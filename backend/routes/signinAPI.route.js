const express = require("express");
const router = express.Router();
const signupAPIModel = require("../models/signin/signupAPI.model");
const signinAPIModel = require("../models/signin/signinAPI.model");
const signinStatusModel = require("../models/signin/signinStatus.model");
const commonView = require("../views/common.view");

router.post("/api/user", signupAPIModel);
router.put("/api/user/auth", signinAPIModel);
router.get("/api/user/auth", signinStatusModel);
router.delete("/api/user/auth", (req, res) => {
    res.clearCookie("token");
    commonView.renderSuccessful(res);
});

module.exports = {

    signupAPIRouter: router,
    signinAPIRouter: router,
    signoutAPIRouter: router,
    signinStatusAPIRouter: router

};