import addDrama from "./add.drama.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        addDrama(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};