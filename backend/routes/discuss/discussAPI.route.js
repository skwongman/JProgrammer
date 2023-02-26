const express = require("express");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();
const discussAPIModel = require("../../models/discuss/discussAPI.model");

router.post("/api/discuss", upload.single("discussPhoto"), discussAPIModel);

module.exports = router;