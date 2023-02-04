import latestList from "./latest.list.js";
import latestSortlist from "./latest.sortlist.js";
import popularList from "./latest.popularList.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        latestList(),
        latestSortlist(),
        popularList(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};