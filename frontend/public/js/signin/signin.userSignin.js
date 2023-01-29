export default function userSignin(){

    $("#handleSigninBtn").click(() => {
        // Add loading effect
        topbar.show();

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
            if(data.error && data.message == "The user input do not match with the designated format" || data.message == "The email is not found"){
                // Remove loading effect
                topbar.hide();

                setTimeout(() => {
                    alert("請輸入正確註冊資料！");
                }, 500);
            };

            if(data.error && data.message == "The email or password is not correct"){
                // Remove loading effect
                topbar.hide();

                setTimeout(() => {
                    alert("電子信箱或密碼不正確，請重新輸入！");
                }, 500);
            };

            if(data.ok){
                // Redirect the user to the index page right after the login is successful.
                location.href = "/";

                // Clear the user input information right after the login is successful.
                signinEmail.value = "";
                signinPassword.value = "";

                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(signin.userSignin.js): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

    // Direct the user to signup if they do not have account.
    $("#signinReminder").click(() => {
        $("#signinContainer").css("display", "none");
        $("#signupContainer").css("display", "block");
    });

};