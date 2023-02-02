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

            // After clicking the "add drama" button on the navigation bar, the user will be redireced to the signin page if they have not logged in.
            $("#addDrama").click(() => {
                location.href = "/signin";
            });

            $("#addDramaMobile").click(() => {
                location.href = "/signin";
            });
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

            // After clicking the "add drama" button on the navigation bar, the user will be redireced to the add drama page if they have logged in.
            $("#addDrama").click(() => {
                location.href = "/add";
            });

            $("#addDramaMobile").click(() => {
                location.href = "/add";
            });           
        };

    })
    .catch(error => {
        console.log("Error(signin.userSigninStatus.js): " + error);
    });

};