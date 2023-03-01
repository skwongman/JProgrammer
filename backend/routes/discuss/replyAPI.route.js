const express = require("express");
const multer = require("multer");
const upload = multer({dest: "./backend/uploads"});
const router = express.Router();
const replyAPIModel = require("../../models/discuss/replyAPI.model");

router.post("/api/reply", upload.single("replyPhoto"), replyAPIModel);

module.exports = router;