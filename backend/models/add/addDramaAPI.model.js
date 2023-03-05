const { client, ObjectId, s3, generateTimeString } = require("../../commons/common");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        // Decode the member id from JWT of cookie.
        const token = req.cookies.token;
        const secretKey = process.env.JWT_SECRET_KEY;

        jwt.verify(token, secretKey, (err, decoded) => {
            // If the decode is not successful.
            if(decoded == undefined){
                commonView.renderForbidden(res);
                return;
            };

            // If the decode is successful.
            client.connect(err => {
                if(err){
                    const errorMessage = "Error(addDramaAPI.model.js - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    if(err){
                        const errorMessage = "Error(addDramaAPI.model.js - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    if(checkMemberIDResult){
                        const {
                            addDramaTitle,
                            addDramaTitleJp,
                            addDramaCategory,
                            addDramaIntroduction,
                            addDramaTV,
                            addDramaDateOfBroadcast,
                            addDramaWeek,
                            addDramaTimeOfBoardcast,
                            addDramaActor,
                            addDramaMedia
                        } = req.body;
                    
                        let addDramaRating = req.body.addDramaRating || "None";
                        let addDramaVideo = req.body.addDramaVideo || "None";

                        // Use regex to verify the user input.
                        const {
                            titleRegex, titleJpRegex, categoryRegex, introductionRegex, TVRegex, dateRegex,
                            weekRegex, timeRegex, actorRegex, ratingRegex, mediaRegex, videoRegex
                        } = commonView.renderDramaRegex();
    
                        // If the regex is invalid.
                        if(!addDramaTitle.match(titleRegex)){
                            commonView.renderTitleFormat(res);
                            return;
                        }
                        else if(!addDramaTitleJp.match(titleJpRegex)){
                            commonView.renderJpTitleFormat(res);
                            return;
                        }
                        else if(!addDramaCategory.match(categoryRegex)){
                            commonView.renderCategoryFormat(res);
                            return;
                        }
                        else if(!addDramaIntroduction.match(introductionRegex)){
                            commonView.renderIntroductionFormat(res);
                            return;
                        }
                        else if(!addDramaTV.match(TVRegex)){
                            commonView.renderTVFormat(res);
                            return;
                        }
                        else if(!addDramaDateOfBroadcast.match(dateRegex)){
                            commonView.renderDateFormat(res);
                            return;
                        }
                        else if(!addDramaWeek.match(weekRegex)){
                            commonView.renderWeekFormat(res);
                            return;
                        }
                        else if(!addDramaTimeOfBoardcast.match(timeRegex)){
                            commonView.renderTimeFormat(res);
                            return;
                        }
                        else if(!addDramaActor.match(actorRegex)){
                            commonView.renderActorFormat(res);
                            return;
                        }
                        else if(!addDramaRating.match(ratingRegex)){
                            commonView.renderRatingFormat(res);
                            return;
                        }
                        else if(!addDramaMedia.match(mediaRegex)){
                            commonView.renderMediaFormat(res);
                            return;
                        }
                        else if(!addDramaVideo.match(videoRegex)){
                            commonView.renderVideoFormat(res);
                            return;
                        };
    
                        // if the regex is valid.
                        client.connect(err => {
                            if(err){
                                const errorMessage = "Error(addDramaAPI.model.js - 3): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };
                    
                            // Check whether the user input drama title has been registerd in the database.
                            const collection = req.db.collection("drama");
                            const checkaddDramaTitle = { dramaTitle: addDramaTitle };
                    
                            collection.findOne(checkaddDramaTitle, (err, result) => {
                                if(err){
                                    const errorMessage = "Error(addDramaAPI.model.js - 4): " + err;
                                    commonView.renderError(err, res, errorMessage);
                                    return;
                                };
                    
                                // If drama title is found.
                                if(result){
                                    commonView.renderTitleRegistered(res);
                                    return;
                                };

                                // If drama title is not found.
                                if(!result){
                                    // Get the drama ID from the lastest drama ID before adding drama record.
                                    const sortlisted = { projection: {_id: 0, dramaID: 1} };
                                    const findLatestDramaID = { dramaID: -1 };
                            
                                    collection.find({}, sortlisted).limit(1).sort(findLatestDramaID).toArray((err, dramaIdResult) => {
                                        if(err){
                                            const errorMessage = "Error(addDramaAPI.model.js - 5): " + err;
                                            commonView.renderError(err, res, errorMessage);
                                            return;
                                        };

                                        if(dramaIdResult){
                                            // Retrieve the drama photo data from the frontend side.
                                            const { uploadPhoto, photoExtension, matchTypeOfPhoto, meetPhotoUploadSize } = commonView.renderPhotoUpload(req);

                                            if(!matchTypeOfPhoto){
                                                commonView.renderTypeOfPhoto(res);
                                                return;
                                            };

                                            if(!meetPhotoUploadSize){
                                                commonView.renderPhotoUploadSize(res);
                                                return;
                                            };

                                            // AWS S3 upload setting.
                                            const params = commonView.renderAWS(photoExtension, uploadPhoto, fs);
                                        
                                            // Upload drama cover photo.
                                            s3.upload(params, (err, data) => {
                                                // Upload error message.
                                                if(err){
                                                    const errorMessage = "Error(addDramaAPI.model.js - 6): " + err;
                                                    commonView.renderError(err, res, errorMessage);
                                                    return;
                                                };
                                        
                                                const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                                                const addDramaCoverPhotoName = data.Location.split("/").pop();
                                                const addDramaCoverPhotoURL = CdnURL + addDramaCoverPhotoName;
                    
                                                // Data clearance before adding record.
                                                const {
                                                    latestDramaID, clearAddDramaCategory, clearAddDramaActor, clearAddDramaCast,
                                                    clearAddDramaRatingList, clearAddDramaVideoList, addDramaMemberID
                                                } = commonView.renderConvertAddDramaData(
                                                    dramaIdResult, addDramaCategory, addDramaActor, addDramaRating, addDramaVideo, checkMemberIDResult
                                                );

                                                const insertQuery = {
                                                    dramaID: latestDramaID,
                                                    dramaTitle: addDramaTitle,
                                                    dramaTitleJp: addDramaTitleJp,
                                                    dramaIntroduction: addDramaIntroduction,
                                                    dramaDateOfBoardcast: addDramaDateOfBroadcast,
                                                    dramaCategory: clearAddDramaCategory,
                                                    dramaActor: clearAddDramaActor,
                                                    dramaCast: clearAddDramaCast,
                                                    dramaCoverPhoto: addDramaCoverPhotoURL,
                                                    dramaRating: clearAddDramaRatingList,
                                                    dramaTV: addDramaTV,
                                                    dramaWeek: addDramaWeek,
                                                    dramaTimeOfBoardcast: addDramaTimeOfBoardcast,
                                                    dramaViewCount: 0,
                                                    dramaMedia: addDramaMedia,
                                                    dramaVideo: clearAddDramaVideoList,
                                                    dramaMemberID: addDramaMemberID,
                                                    dramaCreatedTime: generateTimeString()
                                                };
                            
                                                // Insert drama data into the database.
                                                collection.insertOne(insertQuery, (err, insertResult) => {
                                                    if(err){
                                                        const errorMessage = "Error(addDramaAPI.model.js - 7): " + err;
                                                        commonView.renderError(err, res, errorMessage);
                                                        return;
                                                    };

                                                    if(insertResult){
                                                        // Find the newly added drama ID.
                                                        const insertDramaID = insertResult.insertedId.toString();
                                                        const checkDramaID = { _id: new ObjectId(insertDramaID) };
                        
                                                        collection.findOne(checkDramaID, (err, checkaddDramaIdResult) => {
                                                            if(err){
                                                                const errorMessage = "Error(addDramaAPI.model.js - 8): " + err;
                                                                commonView.renderError(err, res, errorMessage);
                                                                return;
                                                            };

                                                            if(checkaddDramaIdResult){
                                                                const result = {"addDramaID": checkaddDramaIdResult.dramaID};
                                                                
                                                                commonView.renderSuccessfulData(result, res);
                                                                return;
                                                            };
                                                        });
                                                    };
                                                });
                                            });
                                        };
                                    });
                                };
                            });
                        });
                    };
                });
            });
        });
    }

};

module.exports = model.init;