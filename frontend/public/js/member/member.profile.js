export default function memberProfile(){

    const model = {

        init: function(){

            // Check user signin status before page loading.
            function webInitialLoadFunc(){
                view.renderAddLoadingEffect();

                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                userAuth("/api/user/auth")
                .then(data => {
                    view.renderUserAuth(data);
                })
                .catch(error => {
                    view.renderUserAuthError(error);
                });
            };
            webInitialLoadFunc();

            // Handle sign out button click.
            function signoutFunc(){
                $("#handleSignoutBtn").click(() => {
                    view.renderAddLoadingEffect();

                    async function userSignout(url, method){
                        const response = await fetch(url, method);
                        const data = await response.json();
                        return data;
                    };

                    userSignout("/api/user/auth", {
                        method: "DELETE"
                    })
                    .then(data => {
                        view.renderSignout(data);
                    })
                    .catch(error => {
                        view.renderSignoutError(error);
                    });
                });
            };
            signoutFunc();

            // Handle photo preview click.
            function photoPreviewFunc(){
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
            };
            photoPreviewFunc();

            // Handle photo upload click.
            function photoUploadFunc(){
                $("#updatePhotoBtn").click(() => {
                    view.renderAddLoadingEffect();

                    // Pack photo data by using form data approach before fetching API.
                    const updateProfilePhoto = $("#updateProfilePhoto").get(0).files[0];
                    
                    if(updateProfilePhoto == undefined){
                        alert("請選擇要上傳的個人圖片！");

                        view.renderRemoveLoadingEffect();

                        return;
                    };

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
                        view.renderUploadPhoto(data);
                    })
                    .catch(error => {
                        view.renderUploadPhotoError(error);
                    });
                });
            };
            photoUploadFunc();

            // Handle change password click.
            function updatePasswordFunc(){
                $("#updatePasswordBtn").click(() => {
                    view.renderAddLoadingEffect();

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
                        view.renderUpdatePassword(data);
                    })
                    .catch(error => {
                        view.renderUpdatePasswordError(error);
                    });
                });
            };
            updatePasswordFunc();

            // Hover effect for setting titles.
            function clickColorEffectFunc(){
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
            clickColorEffectFunc();
        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderUserAuth: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                view.renderRemoveLoadingEffect();
            }
            else if(data.data){
                $("#profilePhoto").attr("src", data.data.memberProfilePicture);
                $("#memberContentContainer").css("visibility", "visible");

                view.renderRemoveLoadingEffect();
            };
        },

        renderUserAuthError: function(error){
            console.log("Error(member.profile.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderSignout: function(data){
            if(data.ok){
                location.href = "/";

                view.renderRemoveLoadingEffect();
            };
        },

        renderSignoutError: function(error){
            console.log("Error(member.profile.js - 2): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderUploadPhoto: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                $("#profilePhoto").attr("src", "");
                $("#profilePhoto").attr("src", data.data);
                $(".nav-bar-right-title-profile-picture").attr("src", "");
                $(".nav-bar-right-title-profile-picture").attr("src", data.data);
                $("#updateProfilePhoto").val("");
    
                view.renderRemoveLoadingEffect();
            };
        },

        renderUploadPhotoError: function(error){
            console.log("Error(member.profile.js - 3): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderUpdatePassword: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/";

                view.renderRemoveLoadingEffect();
            };

            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("抱歉！請設定8個字元或以上的密碼。");

                view.renderRemoveLoadingEffect();
            };

            if(data.ok){
                alert("密碼更改成功！建議立即使用新密碼重新登入。")

                // Clear the user input after update.
                $("#updatePasswordInput").val("");
    
                view.renderRemoveLoadingEffect();
            };
        },

        renderUpdatePasswordError: function(error){
            console.log("Error(member.profile.js - 4): " + error);

            view.renderRemoveLoadingEffect();
        },

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};