const express = require("express");
const router = express.Router();
const dramaAPIModel = require("../models/index/dramaAPI.model");
const popularAPIModel = require("../models/index/popularAPI.model");
const timetableAPIModel = require("../models/index/timetableAPI.model");
const searchDramaAPIModel = require("../models/index/searchDramaAPI.model");
const cache = require("../commons/redis");

router.get("/api/drama", cache, dramaAPIModel);
router.get("/api/drama/popular", cache, popularAPIModel);
router.get("/api/drama/timetable", cache, timetableAPIModel);
router.get("/api/drama/search", cache, searchDramaAPIModel);

module.exports = {

    dramaAPIRouter: router,
    popularAPIRouter: router,
    timetableAPIRouter: router,
    searchDramaAPIRouter: router

};