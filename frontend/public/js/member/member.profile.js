export default function memberProfile(){

    // Add loading effect
    topbar.show();

    // Check user signin status before page loading.
    async function userAuth(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    userAuth("/api/user/auth")
    .then(data => {
        if(data.error && data.message == "forbidden"){
            location.href = "/";

            // Remove loading effect
            topbar.hide();
        }
        else if(data.data){
            $("#profilePhoto").attr("src", data.data.memberProfilePicture);
            $("#memberContentContainer").css("visibility", "visible");

            // Remove loading effect
            topbar.hide();
        };
    })
    .catch(error => {
        console.log("Error(member.profile.js - 1): " + error);

        // Remove loading effect
        topbar.hide();
    });

    // Handle sign out button click.
    $("#handleSignoutBtn").click(() => {
        // Add loading effect
        topbar.show();

        async function userSignout(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        userSignout("/api/user/auth", {
            method: "DELETE"
        })
        .then(data => {
            if(data.ok){
                location.href = "/";

                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(member.profile.js - 2): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

    // Handle photo preview click.
    $("#updateProfilePhoto").change((e) => {

        const photoToBeUploaded = e.target.files[0];
        const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
        const matchTypeOfPhoto = typeOfPhotoAllowed.includes(photoToBeUploaded.type);
        const meetPhotoUploadSize = photoToBeUploaded.size <= 1000000;

        // The type of photo to be uploaded should be jpeg, jpg or png.
        if(!matchTypeOfPhoto){
            alert("個人圖片格式必須是jpeg、jpg、png！ ");

            // Upload photo data clearance.
            e.target.value = "";
        }
        // The size of photo to be uploaded should be 1MB or below.
        else if(!meetPhotoUploadSize){
            alert("請選擇容量少於1MB的個人圖片！");

            // Upload photo data clearance.
            e.target.value = "";
        }
        else{
            // Add the temp photo link to the html DOM for instance photo preview.
            const tempPhotoLink = URL.createObjectURL(photoToBeUploaded);
            
            $("#profilePhoto").attr("src", "");
            $("#profilePhoto").attr("src", tempPhotoLink);
        };

    });

    // Handle photo upload click.
    $("#updatePhotoBtn").click(() => {
        // Add loading effect
        topbar.show();

        // Pack photo data by using form data approach before fetching API.
        const updateProfilePhoto = $("#updateProfilePhoto").get(0).files[0];
        const updateProfilePhotoData = new FormData();
        updateProfilePhotoData.append("updateProfilePhoto", updateProfilePhoto);

        // Fetching data to the backend side.
        async function updateData(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        updateData(`/api/member/photo`, {
            method: "PUT",
            body: updateProfilePhotoData
        })
        .then(data => {
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                // Remove loading effect
                topbar.hide();
            }
            else if(data.data){
                $("#profilePhoto").attr("src", "");
                $("#profilePhoto").attr("src", data.data);
                $(".nav-bar-right-title-profile-picture").attr("src", "");
                $(".nav-bar-right-title-profile-picture").attr("src", data.data);
    
                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(member.profile.js - 3): " + error);

            // Remove loading effect
            topbar.hide();
        });
    
    });

    // Handle photo upload click.
    $("#updatePasswordBtn").click(() => {

        // Add loading effect
        topbar.show();

        const updatePassword = $("#updatePasswordInput").val();

        // Fetching data to the backend side.
        async function updateData(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        updateData(`/api/member/password`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "updatePassword": updatePassword
            })
        })
        .then(data => {
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                // Remove loading effect
                topbar.hide();
            };

            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("抱歉！請設定8個字元或以上的密碼。");

                // Remove loading effect
                topbar.hide();
            };

            if(data.ok){
                alert("密碼更改成功！建議立即使用新的密碼重新登入。")

                // Clear the user input after update.
                $("#updatePasswordInput").val("");
    
                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(member.profile.js - 4): " + error);

            // Remove loading effect
            topbar.hide();
        });
    
    });

    // Hover effect for setting titles.
    $(document).ready(function(){
        $(".profile-setting-password-color").hover(
            function(){
                $(this).addClass("hover-effect");
            },
            function(){
                $(this).removeClass("hover-effect");
            }
        );
        $(".profile-setting-content-color").hover(
            function(){
                $(this).addClass("hover-effect");
            },
            function(){
                $(this).removeClass("hover-effect");
            }
        );
    });

    // Handle update photo button effect click.
    $("#profileUpdatePhotoTextColor").click(() => {
        $("#profileUpdatePasswordContainer").hide();
        $("#profileUpdatePhotoContainer").show();
        $("#profileUpdatePhotoTextColor").css("color", "rgb(2, 177, 247)");
        $("#profileUpdatePasswordTextColor").css("color", "#000");
    });

    // Handle update password button effect click.
    $("#profileUpdatePasswordTextColor").click(() => {
        $("#profileUpdatePhotoContainer").hide();
        $("#profileUpdatePasswordContainer").show();
        $("#profileUpdatePasswordTextColor").css("color", "rgb(2, 177, 247)");
        $("#profileUpdatePhotoTextColor").css("color", "#000");
    });

};