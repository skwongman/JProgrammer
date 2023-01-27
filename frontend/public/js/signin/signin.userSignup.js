export default function userSignup(){

    document.querySelector("#handleSignupBtn").addEventListener("click", () => {

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
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });

    });


    document.querySelector("#handleSigninBtn").addEventListener("click", () => {

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
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });

    });


    document.querySelector("#handleSignoutBtn").addEventListener("click", () => {

        async function userSignoutData(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };

        userSignoutData("/api/user/auth", {
            method: "DELETE"
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });

    });


    async function userSigninStatusData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    userSigninStatusData("/api/user/auth")
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });


};