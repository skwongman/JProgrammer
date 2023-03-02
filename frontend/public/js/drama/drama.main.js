import getEachDramaData from "./drama.getEachDramaData.js";
import editCoverPhoto from "./drama.editCoverPhoto.js";
import createPost from "./drama.createPost.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

await Promise.all([
    getEachDramaData(),
    editCoverPhoto(),
    createPost(),
    userSigninStatus()
]);