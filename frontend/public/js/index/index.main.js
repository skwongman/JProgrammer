import getLatestSeasonDramaData from "./index.getLatestSeasonDramaData.js";
import getPopularDramaData from "./index.getPopularDramaData.js";
import getTimetableData from "./index.getTimetableData.js";

export default function indexMain(){

    getLatestSeasonDramaData();
    getPopularDramaData();
    getTimetableData();

};