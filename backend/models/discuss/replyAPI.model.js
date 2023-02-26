const { client, ObjectId, s3 } = require("../../commons/common");
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
            const {
                replyDramaTitle, replyContent, handleReplyPostID, uploadPhoto, photoExtension, postRegex
            } = commonView.renderDiscussReplyUserInput(req);

            if(!replyContent.match(postRegex)){
                commonView.renderIncorrectFormat(res);
                return;
            };

            client.connect(err => {
                // Error message.
                if(err){
                    const errorMessage = "Error(replyAPI.model - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                // AWS S3 upload setting.
                const params = commonView.renderAWS(photoExtension, uploadPhoto, fs);
        
                // Upload drama cover photo.
                s3.upload(params, (err, uploadData) => {
                    // Upload error message.
                    if(err){
                        const errorMessage = "Error(replyAPI.model - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    const memberCollection = req.db.collection("member");
                    const memberID = decoded.memberID;
                    const checkMemberID = { _id: new ObjectId(memberID) };

                    memberCollection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                        // Internal server error message.
                        if(err){
                            const errorMessage = "Error(replyAPI.model - 3): " + err;
                            commonView.renderError(err, res, errorMessage);
                            return;
                        };

                        const collection = req.db.collection("reply");
                        const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                        const replyPhotoName = uploadData.Location.split("/").pop();
                        const replyPhotoURL = CdnURL + replyPhotoName;
                        const handledReplyContent = replyContent.replace(/blob:https:\/\/[^\/]+\/[^"]+/, replyPhotoURL);
                        const replyMemberID = checkMemberIDResult._id.toString();
                        const replyMemberName = checkMemberIDResult.memberName;
                        const replyMemberProfilePicture = checkMemberIDResult.memberProfilePicture;
                        const defaultLikeCount = 0;

                        // Record the data insert time.
                        const date = new Date();
                        const offset = 8;
                        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                        const nd = new Date(utc + (3600000 * offset));
                        const hkTime = new Date(nd.getTime() + (3600000 * offset));
                        const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                        const replyCreatedTime = hkTimeString;

                        function generateReplyID(){
                            const date = new Date();
                            const year = date.getUTCFullYear().toString();
                            const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
                            const day = date.getUTCDate().toString().padStart(2, "0");
                            const hours = date.getUTCHours().toString().padStart(2, "0");
                            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
                            const seconds = date.getUTCSeconds().toString().padStart(2, "0");
                            const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");
                            const hkTime = year + month + day + hours + minutes + seconds + milliseconds;
                            const replyID = parseInt(hkTime);
                            return replyID;
                        };

                        const insertQuery = {
                            replyID: generateReplyID(),
                            replyPostID: handleReplyPostID,
                            replyDramaTitle: replyDramaTitle,
                            replyContent: handledReplyContent,
                            replyMemberID: replyMemberID,
                            replyMemberName: replyMemberName,
                            replyMemberProfilePicture: replyMemberProfilePicture,
                            replyLike: defaultLikeCount,
                            replyCreatedTime: replyCreatedTime
                        };
                
                        collection.insertOne(insertQuery, (err, insertResult) => {
                            if(err){
                                const errorMessage = "Error(replyAPI.model - 4): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };
                
                            const insertReplyID = insertResult.insertedId.toString();
                            const checkReplyID = { _id: new ObjectId(insertReplyID) };
                
                            collection.findOne(checkReplyID, (err, checkReplyIdResult) => {
                                // Internal server error message.
                                if(err){
                                    const errorMessage = "Error(replyAPI.model - 5): " + err;
                                    commonView.renderError(err, res, errorMessage);
                                    return;
                                };

                                if(checkReplyIdResult){
                                    commonView.renderSuccessful(res);
                                    return;
                                };
                            });
                        });
                    });        
                });
            });
        });
    }

};

module.exports = model.init;