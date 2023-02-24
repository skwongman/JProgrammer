import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};