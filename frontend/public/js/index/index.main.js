import getLatestSeasonDramaData from "./index.getLatestSeasonDramaData.js";
import getPopularDramaData from "./index.getPopularDramaData.js";
import getTimetableData from "./index.getTimetableData.js";

try{
    await Promise.all([getLatestSeasonDramaData(), getPopularDramaData(), getTimetableData()]);
}
catch(err){
    console.log(err);
};