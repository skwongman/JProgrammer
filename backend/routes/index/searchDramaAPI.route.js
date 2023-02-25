const express = require("express");
const router = express.Router();
const searchDramaAPIModel = require("../../models/index/searchDramaAPI.model");

router.get("/api/search", searchDramaAPIModel);

module.exports = router;