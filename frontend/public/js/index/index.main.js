import getLatestSeasonDramaData from "./index.getLatestSeasonDramaData.js";
import getPopularDramaData from "./index.getPopularDramaData.js";
import getTimetableData from "./index.getTimetableData.js";
import searchDrama from "./index.searchDrama.js";
import userSigninStatus from "../signin/signin.userSigninStatus.js";

await Promise.all([
    getLatestSeasonDramaData(),
    getPopularDramaData(),
    getTimetableData(),
    searchDrama(),
    userSigninStatus()
]);