const express = require("express");
const router = express.Router();
const { getAverageColor } = require("fast-average-color-node");

router.post("/api/color", (req, res) => {

    const photoURL = req.body.photoURL;

    getAverageColor(photoURL).then(color => {
        res.json({"data": {"dominantColor": color.value, "isDark": color.isDark}});
    });

});

module.exports = router;