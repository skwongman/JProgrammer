const express = require("express");
const router = express.Router();
const request = require("request");

router.get("/api/video/proxy", (req, res) => {

    const url = req.query.url;
    request(url).pipe(res);

});

module.exports = router;