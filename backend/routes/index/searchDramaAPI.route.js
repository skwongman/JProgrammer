const express = require("express");
const router = express.Router();
const searchDramaAPIModel = require("../../models/index/searchDramaAPI.model");
const cache = require("../../commons/redis");

router.get("/api/drama/search", cache, searchDramaAPIModel);

module.exports = router;