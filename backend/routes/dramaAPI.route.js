const express = require("express");
const router = express.Router();
const dramaQueryStringAPIModel = require("../models/drama/dramaQueryStringAPI.model");
const videoAuthAPIModel = require("../models/drama/videoAuthAPI.model");
const request = require("request");
const TorrentStream = require("torrent-stream");
const cache = require("../commons/redis");

router.get("/api/drama/:id", cache, dramaQueryStringAPIModel);

router.get("/api/video/auth", videoAuthAPIModel);

router.get("/api/video/proxy", (req, res) => {
    const url = req.query.url;
    request(url).pipe(res);
});

router.get("/api/video", (req, res) => {

    // Get the magnet link from the query string
    const magnetLink = req.query.link;

    // Create a new TorrentStream engine
    const engine = TorrentStream(magnetLink);

    // Set the response type to "video/mp4"
    res.type("mp4");

    try{
        // Wait for the engine to ready before streaming the video
        engine.on("ready", () => {
            // Pipe the video data to the response
            const stream = engine.files[0].createReadStream();
            stream.pipe(res);

            // Close the response stream when the video has finished streaming
            stream.on("end", () => {
                res.end();
            });
        });
    }
    catch(err){
        console.log("Error(videoServerAPI.route): " + err);
    };

});

module.exports = {

    dramaQueryStringAPIRouter: router,
    videoAuthAPIRouter: router,
    proxyAPIRouter: router,
    videoServerAPIRouter: router

};