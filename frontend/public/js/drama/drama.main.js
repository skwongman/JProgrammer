import getDramaRating from "./drama.getDramaRating.js";
import getEachDramaData from "./drama.getEachDramaData.js";

try{
    await Promise.all([getDramaRating(), getEachDramaData()]);
}
catch(err){
    console.log(err);
};