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

    const magnetLink = req.query.link;
    const engine = TorrentStream(magnetLink);

    res.type("mp4");

    try{
        engine.on("ready", () => {
            const stream = engine.files[0].createReadStream();
            
            stream.pipe(res);
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