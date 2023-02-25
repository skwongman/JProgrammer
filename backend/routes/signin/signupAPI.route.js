const express = require("express");
const router = express.Router();
const signupAPIModel = require("../../models/signin/signupAPI.model");

router.post("/api/user", signupAPIModel);

module.exports = router;