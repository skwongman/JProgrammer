const express = require("express");
const router = express.Router();
const signinStatusModel = require("../../models/signin/signinStatus.model");

router.get("/api/user/auth", signinStatusModel);

module.exports = router;