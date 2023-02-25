const express = require("express");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();
const updateMemberPhotoAPIModel = require("../../models/member/updateMemberPhotoAPI.model");

router.put("/api/member/photo", upload.single("updateProfilePhoto"), updateMemberPhotoAPIModel);

module.exports = router;