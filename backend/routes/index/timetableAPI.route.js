const express = require("express");
const router = express.Router();
const timetableAPIModel = require("../../models/index/timetableAPI.model");
const cache = require("../../commons/redis");

router.get("/api/drama/timetable", cache, timetableAPIModel);

module.exports = router;