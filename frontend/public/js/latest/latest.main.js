import latestList from "./latest.list.js";
import latestSortlist from "./latest.sortlist.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        latestList(),
        latestSortlist(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};