const express = require("express");
const router = express.Router();
const updateMemberPasswordAPIModel = require("../../models/member/updateMemberPasswordAPI.model");

router.put("/api/member/password", updateMemberPasswordAPIModel);

module.exports = router;