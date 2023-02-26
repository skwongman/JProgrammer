const express = require("express");
const router = express.Router();
const discussLikeCountAPIModel = require("../../models/discuss/discussLikeCountAPI.model");

router.post("/api/like", discussLikeCountAPIModel);

module.exports = router;