const express = require("express");
const router = express.Router();
const searchDramaAPIModel = require("../../models/index/searchDramaAPI.model");

router.get("/api/drama/search", searchDramaAPIModel);

module.exports = router;