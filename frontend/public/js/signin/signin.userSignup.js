export default function userSignup(){

    $("#handleSignupBtn").click(() => {
        // Add loading effect
        topbar.show();

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
            if(data.error && data.message == "The user input do not match with the designated format"){
                // Remove loading effect
                topbar.hide();

                setTimeout(() => {
                    alert("請輸入正確註冊資料！");
                }, 500);
            };

            if(data.error && data.message == "This email has been registered"){
                // Remove loading effect
                topbar.hide();

                setTimeout(() => {
                    alert("此電子信箱已經被註冊！");
                }, 500);
            };

            if(data.ok){
                // Remove loading effect
                topbar.hide();

                setTimeout(() => {
                    alert("註冊成功！");
                    // Clear the user input information right after the registration is successful.
                    signupEmail.value = "";
                    signupName.value = "";
                    signupPassword.value = "";
                }, 500);
            };
        })
        .catch(error => {
            console.log("Error(signin.userSignup.js): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

    // Direct the user to signin if they alreday have account.
    $("#signupReminder").click(() => {
        $("#signupContainer").css("display", "none");
        $("#signinContainer").css("display", "block");
    });

};