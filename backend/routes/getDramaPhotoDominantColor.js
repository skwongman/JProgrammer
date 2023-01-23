const express = require("express");
const router = express.Router();
const { getColorFromURL, getPaletteFromURL } = require("color-thief-node");

router.post("/api/color", (req, res) => {

    (async () => {
        const photoURL = await req.body.photoURL;
        const dominantColor = await getColorFromURL(photoURL);
        const colorPallete = await getPaletteFromURL(photoURL);

        res.json({"data": {"dominantColor": dominantColor, "colorPallete": colorPallete}});
    })();

});

module.exports = router;