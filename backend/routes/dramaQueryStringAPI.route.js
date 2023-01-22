const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/drama/:id", (req, res) => {

    client.connect(err => {
        // Error handling
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(dramaQueryStringAPI.route - 1): " + err);
        };
        
        // Assign names
        let id = req.params.id;
        id = parseInt(id);
        const collection = req.db.collection("drama");
        const matchDramaID = { $match: { dramaID: id } };
        const unwind = {
            $unwind: "$dramaActor"
        }
        const aggreActor = {
            $lookup: {
                from: "actorMix",
                localField: "dramaActor",
                foreignField: "actorNameChi",
                as: "dramaActor"
            }
        };
        const limitNoOfCast = { $limit: 9 }
        const group = {
            $group: {
                _id: "$_id",
                dramaID: { $first: "$dramaID" },
                dramaTitle: { $first: "$dramaTitle" },
                dramaIntroduction: { $first: "$dramaIntroduction" },
                dramaDateOfBoardcast: { $first: "$dramaDateOfBoardcast" },
                dramaCategory: { $first: "$dramaCategory" },
                dramaActor: { $push: "$dramaActor" },
                dramaCast: { $first: "$dramaCast" },
                dramaCoverPhoto: { $first: "$dramaCoverPhoto" },
                dramaRating: { $first: "$dramaRating" },
                dramaTV: { $first: "$dramaTV" },
                dramaWeek: { $first: "$dramaWeek" },
                dramaTimeOfBoardcast: { $first: "$dramaTimeOfBoardcast" },
                dramaMedia: { $first: "$dramaMedia" }
            }
        };
        const dramaDownload = {
            $lookup: {
                from: "download",
                localField: "dramaTitle",
                foreignField: "downloadTitleChi",
                as: "dramaDownload"
            }
        };
        const sortlisted = {
            $project: {
                _id: 0,
                "dramaActor._id": 0,
                "dramaActor._id": 0,
                "dramaActor.actorID": 0,
                "dramaActor.actorNameJp": 0,
                "dramaActor.actorCreatedTime": 0,
                "dramaDownload._id": 0,
                "dramaDownload.downloadID": 0
            }
        };
        const aggregatePipeline = [matchDramaID, unwind, aggreActor, limitNoOfCast, group, dramaDownload, sortlisted];

        // Fetching data
        collection.aggregate(aggregatePipeline).limit(1).toArray((err, result) => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(dramaQueryStringAPI.route - 2): " + err);
            };

            if(result == ""){
                res.status(400).json({"error": true, "message": "ID not found"});
            }
            else{
                res.status(200).json({"data": result[0]});
            };
        });
    });

});

module.exports = router;