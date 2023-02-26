const express = require("express");
const router = express.Router();
const discussQueryStringAPIModel = require("../../models/discuss/discussQueryStringAPI.model");

router.get("/api/discuss/:id", discussQueryStringAPIModel);

module.exports = router;