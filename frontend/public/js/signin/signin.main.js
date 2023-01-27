import userSignup from "./signin.userSignup.js";

try{
    await Promise.all([
        userSignup()
    ]);
}
catch(err){
    console.log(err);
};