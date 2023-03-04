const express = require("express");
const multer = require("multer");
const upload = multer({dest: "./backend/uploads"});
const router = express.Router();
const addDramaAPIModel = require("../models/add/addDramaAPI.model");

router.post("/api/drama/add", upload.single("addDramaCoverphoto"), addDramaAPIModel);

module.exports = router;