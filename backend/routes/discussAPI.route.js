const express = require("express");
const multer = require("multer");
const upload = multer({dest: "./backend/uploads"});
const router = express.Router();
const discussAPIModel = require("../models/discuss/discussAPI.model");
const discussLikeCountAPIModel = require("../models/discuss/discussLikeCountAPI.model");
const discussQueryStringAPIModel = require("../models/discuss/discussQueryStringAPI.model");
const replyAPIModel = require("../models/discuss/replyAPI.model");
const cache = require("../commons/redis");

router.post("/api/discuss", upload.single("discussPhoto"), discussAPIModel);
router.post("/api/discuss/like", discussLikeCountAPIModel);
router.get("/api/discuss/:id", cache, discussQueryStringAPIModel);
router.post("/api/discuss/reply", upload.single("replyPhoto"), replyAPIModel);

module.exports = {

    discussAPIRouter: router,
    replyAPIRouter: router,
    discussQueryStringAPIRouter: router,
    discussLikeCountAPIRouter: router

};