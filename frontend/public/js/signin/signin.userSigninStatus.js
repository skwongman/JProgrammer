export default function userSigninStatus(){

    async function userSigninStatusData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    userSigninStatusData("/api/user/auth")
    .then(data => {
        // Only show the signin page content when the user is not in the login status.
        if(data.error && data.message == "forbidden"){
            $("#signinContentContainer").css("visibility", "visible");
        };

        if(data.data){
            // Hide and show some navigation bar icons after login.
            $("#signinIconBtn").css("display", "none");
            $("#signinBeforeBtn").css("display", "none");
            $("#signinAfterBtn").css("display", "block");
            $("#signinAfterBtn").append(`
                <a href="/member">
                    <img class="nav-bar-right-title-profile-picture" src="${data.data.memberProfilePicture}">
                </a>
            `);

            // After login, user cannot access to the signin page and will be redirected to the index page.
            if(location.href.split("/").pop() == "signin"){
                location.href = "/";
            };
        };

    })
    .catch(error => {
        console.log("Error(signin.userSigninStatus.js): " + error);
    });

};