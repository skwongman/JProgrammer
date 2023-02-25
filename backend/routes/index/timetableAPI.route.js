const express = require("express");
const router = express.Router();
const timetableAPIModel = require("../../models/index/timetableAPI.model");

router.get("/api/timetable", timetableAPIModel);

module.exports = router;