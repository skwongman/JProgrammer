const { client } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res, editDramaID, editDramaContent, updateIndicator){
        // Data clearance to correct format, so facilitate using regex to check the user input.
        let insertValue = null;

        if(updateIndicator == "edit1"){
            insertValue = { $set: { dramaCategory: [editDramaContent] } };
        }
        else if(updateIndicator == "edit2"){
            insertValue = { $set: { dramaIntroduction: editDramaContent } };
        }
        else if(updateIndicator == "edit3"){
            insertValue = { $set: { dramaTV: editDramaContent } };
        }
        else if(updateIndicator == "edit4"){
            insertValue = { $set: { dramaDateOfBoardcast: editDramaContent } };
        }
        else if(updateIndicator == "edit5"){
            insertValue = { $set: { dramaWeek: editDramaContent } };
        }
        else if(updateIndicator == "edit6"){
            insertValue = { $set: { dramaTimeOfBoardcast: editDramaContent } };
        }
        else if(updateIndicator == "edit7"){
            const clearEditDramaContent = editDramaContent.split(", ");
            const dramaVideo = [];

            for(let i of clearEditDramaContent){
                dramaVideo.push(i);
            };

            insertValue = { $set: { dramaVideo: dramaVideo } };
        }
        else if(updateIndicator == "edit8"){
            const clearAddDramaActorCast = editDramaContent.split(", ");
            const clearAddDramaActor = [];
            const clearAddDramaCast = [];

            for(let i of clearAddDramaActorCast){
                clearAddDramaActor.push(i.split(" / ")[0]);
                clearAddDramaCast.push(i.split(" / ")[1] + " / " + i.split(" / ")[0]);
            };

            insertValue = {
                $set: {
                    dramaActor: clearAddDramaActor,
                    dramaCast: clearAddDramaCast
                }
            };
        }
        else if(updateIndicator == "edit9"){
            const clearEditDramaContent = editDramaContent.split(", ");
            const dramaRating = [];

            for(let i of clearEditDramaContent){
                dramaRating.push(i);
            };

            insertValue = { $set: { dramaRating: dramaRating } };
        }
        else if(updateIndicator == "edit10"){
            let clearEditDramaContent = null;

            if(editDramaContent == ""){
                clearEditDramaContent = "None";
                insertValue = { $set: { dramaMedia: clearEditDramaContent } };
            }
            else{
                insertValue = { $set: { dramaMedia: editDramaContent } };
            };
        };

        // Use regex to verify the user input.
        const {
            categoryRegex, introductionRegex, TVRegex, dateRegex, weekRegex,
            timeRegex, actorRegex, ratingRegex, mediaRegex, videoRegex
        } = commonView.renderDramaRegex();

        // If the regex is invalid.
        if(updateIndicator == "edit1" && !editDramaContent.match(categoryRegex)){
            commonView.renderCategoryFormat(res);
            return;
        }
        else if(updateIndicator == "edit2" && !editDramaContent.match(introductionRegex)){
            commonView.renderIntroductionFormat(res);
            return;
        }
        else if(updateIndicator == "edit3" && !editDramaContent.match(TVRegex)){
            commonView.renderTVFormat(res);
            return;
        }
        else if(updateIndicator == "edit4" && !editDramaContent.match(dateRegex)){
            commonView.renderDateFormat(res);
            return;
        }
        else if(updateIndicator == "edit5" && !editDramaContent.match(weekRegex)){
            commonView.renderWeekFormat(res);
            return;
        }
        else if(updateIndicator == "edit6" && !editDramaContent.match(timeRegex)){
            commonView.renderTimeFormat(res);
            return;
        }
        else if(updateIndicator == "edit7" && !editDramaContent.match(videoRegex)){
            commonView.renderVideoFormat(res);
            return;
        }
        else if(updateIndicator == "edit8" && !editDramaContent.match(actorRegex)){
            commonView.renderActorFormat(res);
            return;
        }
        else if(updateIndicator == "edit9" && !editDramaContent.match(ratingRegex)){
            commonView.renderRatingFormat(res);
            return;
        }
        else if(updateIndicator == "edit10" && !editDramaContent.match(mediaRegex)){
            commonView.renderMediaFormat(res);
            return;
        };

        // if the regex is valid.
        client.connect(err => {
            if(err){
                const errorMessage = "Error(editDramaInformationAPI.model - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };

            const collection = req.db.collection("drama2");
            const insertQuery = { dramaID: editDramaID };

            collection.updateOne(insertQuery, insertValue, (err, result) => {
                if(err){
                    const errorMessage = "Error(editDramaInformationAPI.model - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                if(result){
                    collection.findOne({dramaID: editDramaID}, (err, editResult) => {
                        if(err){
                            const errorMessage = "Error(editDramaInformationAPI.model - 3): " + err;
                            commonView.renderError(err, res, errorMessage);
                            return;
                        };
    
                        if(editResult){
                            if(updateIndicator == "edit1"){
                                commonView.renderSuccessfulData(editResult.dramaCategory, res);
                                return;
                            }
                            else if(updateIndicator == "edit2"){
                                commonView.renderSuccessfulData(editResult.dramaIntroduction, res);
                                return;
                            }
                            else if(updateIndicator == "edit3"){
                                commonView.renderSuccessfulData(editResult.dramaTV, res);
                                return;
                            }
                            else if(updateIndicator == "edit4"){
                                commonView.renderSuccessfulData(editResult.dramaDateOfBoardcast, res);
                                return;
                            }
                            else if(updateIndicator == "edit5"){
                                commonView.renderSuccessfulData(editResult.dramaWeek, res);
                                return;
                            }
                            else if(updateIndicator == "edit6"){
                                commonView.renderSuccessfulData(editResult.dramaTimeOfBoardcast, res);
                                return;
                            }
                            else if(updateIndicator == "edit7"){
                                commonView.renderSuccessfulData(editResult.dramaVideo, res);
                                return;
                            }
                            else if(updateIndicator == "edit9"){
                                commonView.renderSuccessfulData(editResult.dramaRating, res);
                                return;
                            }
                            else if(updateIndicator == "edit10"){
                                commonView.renderSuccessfulData(editResult.dramaMedia, res);
                                return;
                            };
                        };
                    });
    
                    // Mapping with the drama actor database.
                    if(updateIndicator == "edit8"){
                        const matchDramaID = { $match: { dramaID: editDramaID } };
    
                        const unwind = { $unwind: "$dramaActor" };
    
                        const aggreActor = {
                            $lookup: {
                                from: "actor2",
                                localField: "dramaActor",
                                foreignField: "actorNameChi",
                                as: "dramaActor"
                            }
                        };
    
                        const limitNoOfCast = { $limit: 9 };
    
                        const group = {
                            $group: {
                                _id: "$_id",
                                dramaID: { $first: "$dramaID" },
                                dramaActor: { $push: "$dramaActor" },
                                dramaCast: { $first: "$dramaCast" }
                            }
                        };
                        
                        const sortlisted = {
                            $project: {
                                _id: 0,
                                "dramaActor._id": 0,
                                "dramaActor._id": 0,
                                "dramaActor.actorID": 0,
                                "dramaActor.actorNameJp": 0,
                                "dramaActor.actorCreatedTime": 0
                            }
                        };
        
                        const aggregatePipeline = [matchDramaID, unwind, aggreActor, limitNoOfCast, group, sortlisted];
        
                        // Fetching data
                        collection.aggregate(aggregatePipeline).limit(1).toArray((err, result) => {
                            if(err){
                                const errorMessage = "Error(editDramaInformationAPI.model - 4): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };
    
                            if(result){
                                commonView.renderEditInformationSuccessful(res, result);
                                return;
                            };
                        });
                    };
                };
            });
        });
    }

};

module.exports = model.init;