const express = require("express");
const router = express.Router();

router.get("/api/proxy", (req, res) => {

    const url = req.query.url;
    const request = require("request");
    request(url).pipe(res);

});

module.exports = router;