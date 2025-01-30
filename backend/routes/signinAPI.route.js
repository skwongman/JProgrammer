const express = require("express");
const router = express.Router();
const signupAPIModel = require("../models/signin/signupAPI.model");
const signinAPIModel = require("../models/signin/signinAPI.model");
const signinStatusModel = require("../models/signin/signinStatus.model");
const signinOauthAPIModel = require("../models/signin/signinOauthAPI.model");
const signinOauthCallbackAPIModel = require("../models/signin/signinOauthCallbackAPI.model");
const signinOauthStatusAPIModel = require("../models/signin/signinOauthSatusAPI.model");
const commonView = require("../views/common.view");

router.post("/api/user", signupAPIModel);
router.put("/api/user/auth", signinAPIModel);
router.get("/api/user/auth", signinStatusModel);
router.delete("/api/user/auth", (req, res) => {
    res.clearCookie("token");
    commonView.renderSuccessful(res);
});

router.post("/api/user/oauth/login", signinOauthAPIModel);
router.get("/api/user/oauth/callback", signinOauthCallbackAPIModel);
router.get("/api/user/oauth", signinOauthStatusAPIModel);

module.exports = {

    signupAPIRouter: router,
    signinAPIRouter: router,
    signoutAPIRouter: router,
    signinStatusAPIRouter: router,
    signinOauthAPIRouter: router,
    signinOauthCallbackAPIRouter: router,
    signinOauthStatusAPIRouter: router,

};