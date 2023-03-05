const { client } = require("../../commons/common");
const commonView = require("../../views/common.view");
const { getAverageColor } = require("fast-average-color-node");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(dramaQueryStringAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
            
            const id = parseInt(req.params.id);
            const collection = req.db.collection("drama");
            const matchDramaID = { $match: { dramaID: id } };
            const unwind = { $unwind: "$dramaActor" };
            
            const aggreActor = {
                $lookup: {
                    from: "actor",
                    localField: "dramaActor",
                    foreignField: "actorNameChi",
                    as: "dramaActor"
                }
            };

            const limitNoOfCast = { $limit: 9 }; // No. of casts to be displayed
            
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
                    dramaMedia: { $first: "$dramaMedia" },
                    dramaVideo: { $first: "$dramaVideo" }
                }
            };

            const dramaDownloadJp = {
                $lookup: {
                    from: "downloadJp",
                    localField: "dramaTitle",
                    foreignField: "downloadTitleChi",
                    as: "dramaDownloadJp"
                }
            };

            const dramaDownloadChi = {
                $lookup: {
                    from: "downloadChi",
                    localField: "dramaTitle",
                    foreignField: "downloadTitleChi",
                    as: "dramaDownloadChi"
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
                    "dramaDownloadJp._id": 0,
                    "dramaDownloadJp.downloadID": 0,
                    "dramaDownloadChi._id": 0,
                    "dramaDownloadChi.downloadID": 0
                }
            };

            const aggregatePipeline = [matchDramaID, unwind, aggreActor, limitNoOfCast, group, dramaDownloadJp, dramaDownloadChi, sortlisted];
    
            // Fetching data
            collection
            .aggregate(aggregatePipeline)
            .limit(1)
            .toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(dramaQueryStringAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
    
                if(result == ""){
                    commonView.renderDataNotFound(res);
                    return;
                };
    
                if(result){
                    commonView.renderDramaQueryStringData(result, res, getAverageColor);
                    return;
                };
            });
        });
    }

};

module.exports = model.init;