import latestList from "./latest.list.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        latestList(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};