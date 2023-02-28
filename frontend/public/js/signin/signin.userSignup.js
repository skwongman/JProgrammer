export default function userSignup(){

    const model = {

        init: function(){
            $("#handleSignupBtn").click(() => {
                view.renderAddLoadingEffect();
        
                async function userSignupData(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };
        
                userSignupData("/api/user", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        "name": signupName.value,
                        "email": signupEmail.value,
                        "password": signupPassword.value
                    })
                })
                .then(data => {
                    view.renderSignup(data);
                })
                .catch(error => {
                    view.renderError(error);
                });
            });
        
            // Direct the user to signin section if they alreday have account.
            $("#signupReminder").click(() => {
                $("#signupContainer").css("display", "none");
                $("#signinContainer").css("display", "block");
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

        renderSignup: function(data){
            if(data.error && data.message == "The user input do not match with the designated format"){
                view.renderRemoveLoadingEffect();

                setTimeout(() => {
                    alert("抱歉！請設定8個字元或以上的密碼。");
                }, 500);
            };

            if(data.error && data.message == "This email has been registered"){
                view.renderRemoveLoadingEffect();

                setTimeout(() => {
                    alert("此電子信箱已經被註冊！");
                }, 500);
            };

            if(data.ok){
                view.renderRemoveLoadingEffect();

                setTimeout(() => {
                    alert("註冊成功！");
                    
                    // Clear the user input information right after the registration is successful.
                    signupEmail.value = "";
                    signupName.value = "";
                    signupPassword.value = "";
                }, 500);
            };
        },

        renderError(error){
            console.log("Error(signin.userSignup.js): " + error);
        
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