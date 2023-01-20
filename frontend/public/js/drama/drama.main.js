import getDramaRating from "./drama.getDramaRating.js";

try{
    await Promise.all([getDramaRating()]);
}
catch(err){
    console.log(err);
};