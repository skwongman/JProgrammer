export default function userSignout(){

    $("#handleSignoutBtn").click(() => {
        // Add loading effect
        topbar.show();

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
            location.href = "/";

            // Remove loading effect
            topbar.hide();
        })
        .catch(error => {
            console.log("Error(member.userSignout.js): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

};