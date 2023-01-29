import getLatestSeasonDramaData from "./index.getLatestSeasonDramaData.js";
import getPopularDramaData from "./index.getPopularDramaData.js";
import getTimetableData from "./index.getTimetableData.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        getLatestSeasonDramaData(),
        getPopularDramaData(),
        getTimetableData(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};