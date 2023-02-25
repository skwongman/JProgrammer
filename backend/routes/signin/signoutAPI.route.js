const express = require("express");
const router = express.Router();

router.delete("/api/user/auth", (req, res) => {

    res.clearCookie("token");
    res.status(200).json({"ok": true});

});

module.exports = router;