const express = require("express");
const router = express.Router();
const dramaAPIModel = require("../../models/index/dramaAPI.model");

router.get("/api/drama", dramaAPIModel);

module.exports = router;