import memberProfile from "../member/member.profile.js";

export default function userSigninStatus(){

    const model = {

        init: function(){
            async function userSigninStatusData(url){
                const token = document.cookie?.split("; ")?.find((row) => row.startsWith("token="))?.split("=")[1]

                const response = await fetch(url, {
                    headers: {
                        "Authorization": token
                    }
                });
                const data = await response.json();
                return data;
            };
        
            userSigninStatusData("/api/user/auth")
            .then(data => {
                view.renderSigninStatus(data);
            })
            .then(() => {
                view.renderMemberProfile();
            })
            .catch(error => {
                view.renderError(error);
            })
            
            userSigninStatusData("/api/user/oauth")
            .then(data => {
                view.renderSigninStatus(data);
            })
            .then(() => {
                view.renderMemberProfile();
            })
            .catch(error => {
                view.renderError(error);
            });
        }

    };

    const view = {

        renderSigninStatus: function(data){
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
    
                // User cannot access to the add drama page without login and will be redirected to the index page.
                if(location.href.split("/").pop() == "add"){
                    location.href = "/";
                };
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
        },

        renderMemberProfile: function(){
            if(location.href.split("/").pop() != "member"){
                return false;
            }
            else{
                memberProfile();
            };
        },

        renderError: function(error){
            console.log("Error(signin.userSigninStatus.js): " + error);
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};