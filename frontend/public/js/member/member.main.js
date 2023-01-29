import userSignout from "./member.userSignout.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        userSignout(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};