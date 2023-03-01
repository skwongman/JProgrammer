const express = require("express");
const router = express.Router();
const dramaQueryStringAPIModel = require("../../models/drama/dramaQueryStringAPI.model");
const cache = require("../../commons/redis");

router.get("/api/drama/:id", cache, dramaQueryStringAPIModel);

module.exports = router;