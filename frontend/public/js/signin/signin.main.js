import userSignup from "./signin.userSignup.js";
import userSignin from "./signin.userSignin.js";
import userSigninStatus from "./signin.userSigninStatus.js";

await Promise.all([
    userSignup(),
    userSignin(),
    userSigninStatus()
]);