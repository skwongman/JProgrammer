const express = require("express");
const router = express.Router();
const signinAPIModel = require("../../models/signin/signinAPI.model");

router.put("/api/user/auth", signinAPIModel);

module.exports = router;