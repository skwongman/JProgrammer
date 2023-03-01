const express = require("express");
const router = express.Router();
const popularAPIModel = require("../../models/index/popularAPI.model");
const cache = require("../../commons/redis");

router.get("/api/popular", cache, popularAPIModel);

module.exports = router;