import getDramaRatingData from "./drama.getDramaRatingData.js";
import getEachDramaData from "./drama.getEachDramaData.js";
import getActorData from "./drama.getActorData.js";

try{
    await Promise.all([
        // getDramaRatingData(),
        getEachDramaData(),
        // getActorData()
    ]);
}
catch(err){
    console.log(err);
};