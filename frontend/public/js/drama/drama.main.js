import getEachDramaData from "./drama.getEachDramaData.js";
import editCoverPhoto from "./drama.editCoverPhoto.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        getEachDramaData(),
        editCoverPhoto(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};