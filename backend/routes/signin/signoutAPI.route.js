const express = require("express");
const router = express.Router();
const commonView = require("../../views/common.view");

router.delete("/api/user/auth", (req, res) => {

    res.clearCookie("token");
    commonView.renderSuccessful(res);

});

module.exports = router;