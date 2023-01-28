export default function userSignup(){

    $("#handleSignupBtn").click(() => {
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
                alert("請輸入正確註冊資料！");
            };

            if(data.error && data.message == "This email has been registered"){
                alert("此電子信箱已經被註冊！");
            };

            if(data.ok){
                alert("註冊成功！");
                signupEmail.value = "";
                signupName.value = "";
                signupPassword.value = "";
            };
        })
        .catch(error => {
            console.log("Error(signin.userSignup.js - 1): " + error);
        });
    });

    $("#signupReminder").click(() => {
        $("#signupContainer").css("display", "none");
        $("#signinContainer").css("display", "block");
        $(".footer").css("marginTop", "130px");
    });

};