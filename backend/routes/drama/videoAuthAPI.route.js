const express = require("express");
const router = express.Router();
const videoAuthAPIModel = require("../../models/drama/videoAuthAPI.model");

router.get("/api/video/auth", videoAuthAPIModel);

module.exports = router;