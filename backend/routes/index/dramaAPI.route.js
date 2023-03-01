const express = require("express");
const router = express.Router();
const dramaAPIModel = require("../../models/index/dramaAPI.model");
const cache = require("../../commons/redis");

router.get("/api/drama", cache, dramaAPIModel);

module.exports = router;