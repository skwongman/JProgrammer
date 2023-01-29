import getEachDramaData from "./drama.getEachDramaData.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        getEachDramaData(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};