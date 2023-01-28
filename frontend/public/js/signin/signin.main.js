import userSignup from "./signin.userSignup.js";
import userSignin from "./signin.userSignin.js";
import userSignout from "./signin.userSignout.js";
import userSigninStatus from "./signin.userSigninStatus.js";

try{
    await Promise.all([
        userSignup(),
        userSignin(),
        userSignout(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};