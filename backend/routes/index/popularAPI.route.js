const express = require("express");
const router = express.Router();
const popularAPIModel = require("../../models/index/popularAPI.model");

router.get("/api/popular", popularAPIModel);

module.exports = router;