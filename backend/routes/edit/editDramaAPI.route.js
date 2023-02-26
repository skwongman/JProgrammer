const express = require("express");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();
const editDramaAPIModel = require("../../models/edit/editDramaAPI.model");

router.put("/api/edit/:id", upload.single("editDramaCoverPhoto"), editDramaAPIModel);

module.exports = router;