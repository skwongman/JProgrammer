const express = require("express");
const TorrentStream = require("torrent-stream");
const router = express.Router();

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

module.exports = router;