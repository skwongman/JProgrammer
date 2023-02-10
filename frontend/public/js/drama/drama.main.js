import getEachDramaData from "./drama.getEachDramaData.js";
import editCoverPhoto from "./drama.editCoverPhoto.js";
import editRating from "./drama.editRating.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

try{
    await Promise.all([
        getEachDramaData(),
        editCoverPhoto(),
        editRating(),
        userSigninStatus()
    ]);
}
catch(err){
    console.log(err);
};