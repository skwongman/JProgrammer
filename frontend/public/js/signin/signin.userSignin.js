export default function userSignin(){

    const model = {

        init: function(){
            $("#handleSigninBtn").click(() => {
                view.renderAddLoadingEffect();
        
                async function userSigninData(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };
        
                userSigninData("/api/user/auth", {
                    method: "PUT",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        "email": signinEmail.value,
                        "password": signinPassword.value
                    })
                })
                .then(data => {
                    view.renderSignin(data);
                })
                .catch(error => {
                    view.renderError(error);
                });
            });
        
            // Direct the user to signup if they do not have account.
            $("#signinReminder").click(() => {
                $("#signinContainer").css("display", "none");
                $("#signupContainer").css("display", "block");
            });
        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderSignin: function(data){
            if(data.error && data.message == "The user input do not match with the designated format" || data.message == "The email is not found"){
                view.renderRemoveLoadingEffect();

                setTimeout(() => {
                    alert("請輸入正確註冊資料！");
                }, 500);
            };

            if(data.error && data.message == "The password is not correct"){
                view.renderRemoveLoadingEffect();

                setTimeout(() => {
                    alert("密碼不正確，請重新輸入！");
                }, 500);
            };

            if(data.ok){
                // Redirect the user to the index page right after the login is successful.
                location.href = "/";

                // Clear the user input information right after the login is successful.
                signinEmail.value = "";
                signinPassword.value = "";

                view.renderRemoveLoadingEffect();
            };
        },

        renderError: function(error){
            console.log("Error(signin.userSignin.js): " + error);
        
            view.renderRemoveLoadingEffect();
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};