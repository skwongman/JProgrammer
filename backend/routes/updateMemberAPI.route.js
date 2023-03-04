const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "./backend/uploads"});
const updateMemberPasswordAPIModel = require("../models/member/updateMemberPasswordAPI.model");
const updateMemberPhotoAPIModel = require("../models/member/updateMemberPhotoAPI.model");

router.put("/api/member/password", updateMemberPasswordAPIModel);
router.put("/api/member/photo", upload.single("updateProfilePhoto"), updateMemberPhotoAPIModel);

module.exports = {

    updateMemberPhotoAPIRouter: router,
    updateMemberPasswordAPIRouter: router

};