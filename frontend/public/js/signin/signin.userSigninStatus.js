export default function userSigninStatus(){

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