export default function userSignout(){

    $("#handleSignoutBtn").click(() => {
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
            console.log("signout")
        })
        .catch(error => {
            console.log(error);
        });
    });

};