export default function userSignin(){

    $("#handleSigninBtn").click(() => {
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
                alert("請輸入正確註冊資料！");
            };

            if(data.error && data.message == "The email or password is not correct"){
                alert("電子信箱或密碼不正確，請重新輸入！");
            };

            if(data.ok){
                location.href = "/";
            };
        })
        .catch(error => {
            console.log("Error(signin.userSignin.js): " + error);
        });
    });

    $("#signinReminder").click(() => {
        $("#signinContainer").css("display", "none");
        $("#signupContainer").css("display", "block");
        $(".footer").css("marginTop", "23px");
    });

};