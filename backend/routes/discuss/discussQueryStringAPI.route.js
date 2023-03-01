const express = require("express");
const router = express.Router();
const discussQueryStringAPIModel = require("../../models/discuss/discussQueryStringAPI.model");
const cache = require("../../commons/redis");

router.get("/api/discuss/:id", cache, discussQueryStringAPIModel);

module.exports = router;