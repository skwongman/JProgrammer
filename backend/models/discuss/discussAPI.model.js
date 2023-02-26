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
                discussDramaTitle, discussHeader, discussContent, handleDiscussPostID, uploadPhoto, photoExtension, titleRegex, postRegex
            } = commonView.renderDiscussData(req);

            if(!discussHeader.match(titleRegex)){
                commonView.renderDiscussTitleFormat(res);
                return;
            }
            else if(!discussContent.match(postRegex)){
                commonView.renderDiscussContentFormat(res);
                return;
            };

            client.connect(err => {
                // Error message.
                if(err){
                    const errorMessage = "Error(discussAPI.model - 1): " + err
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                // AWS S3 upload setting.
                const params = commonView.renderAWS(photoExtension, uploadPhoto, fs);
        
                // Upload drama cover photo.
                s3.upload(params, (err, uploadData) => {
                    // Upload error message.
                    if(err){
                        const errorMessage = "Error(discussAPI.model - 2): " + err
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    const memberCollection = req.db.collection("member");
                    const memberID = decoded.memberID;
                    const checkMemberID = { _id: new ObjectId(memberID) };

                    memberCollection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                        // Internal server error message.
                        if(err){
                            const errorMessage = "Error(discussAPI.model - 3): " + err
                            commonView.renderError(err, res, errorMessage);
                            return;
                        };

                        if(checkMemberIDResult){
                            const collection = req.db.collection("discuss");
                            const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                            const discussPhotoName = uploadData.Location.split("/").pop();
                            const discussPhotoURL = CdnURL + discussPhotoName;
                            const handledDiscussContent = discussContent.replace(/blob:https:\/\/[^\/]+\/[^"]+/, discussPhotoURL);
                            const discussMemberID = checkMemberIDResult._id.toString();
                            const discussMemberName = checkMemberIDResult.memberName;
                            const discussMemberProfilePicture = checkMemberIDResult.memberProfilePicture;

                            // Record the data insert time.
                            const date = new Date();
                            const offset = 8;
                            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                            const nd = new Date(utc + (3600000 * offset));
                            const hkTime = new Date(nd.getTime() + (3600000 * offset));
                            const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                            const discussCreatedTime = hkTimeString;
    
                            function generateDiscussID(){
                                const date = new Date();
                                const year = date.getUTCFullYear().toString();
                                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                                const day = date.getUTCDate().toString().padStart(2, '0');
                                const hours = date.getUTCHours().toString().padStart(2, '0');
                                const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                                const seconds = date.getUTCSeconds().toString().padStart(2, '0');
                                const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
                                const hkTime = year + month + day + hours + minutes + seconds + milliseconds;
                                const discussID = parseInt(hkTime);
                                return discussID;
                            };
    
                            const insertQuery = {
                                discussID: generateDiscussID(),
                                discussPostID: handleDiscussPostID,
                                discussDramaTitle: discussDramaTitle,
                                discussHeader: discussHeader,
                                discussContent: handledDiscussContent,
                                discussMemberID: discussMemberID,
                                discussMemberName: discussMemberName,
                                discussMemberProfilePicture: discussMemberProfilePicture,
                                discussCreatedTime: discussCreatedTime
                            };
                    
                            collection.insertOne(insertQuery, (err, insertResult) => {
                                if(err){
                                    const errorMessage = "Error(discussAPI.model - 4): " + err
                                    commonView.renderError(err, res, errorMessage);
                                    return;
                                };

                                if(insertResult){
                                    const insertDiscussID = insertResult.insertedId.toString();
                                    const checkdiscussID = { _id: new ObjectId(insertDiscussID) };
                        
                                    collection.findOne(checkdiscussID, (err, checkDiscussIdResult) => {
                                        // Internal server error message.
                                        if(err){
                                            const errorMessage = "Error(discussAPI.model - 5): " + err
                                            commonView.renderError(err, res, errorMessage);
                                            return;
                                        };

                                        if(checkDiscussIdResult){
                                            // Return the newly added discuss ID to the frontend.
                                            const result = {"discussPostID": checkDiscussIdResult.discussPostID};
                                            
                                            commonView.renderSuccessfulData(result, res);
                                            return;
                                        };
                                    });
                                };
                            });
                        };
                    });        
                });
            });
        });
    }

};

module.exports = model.init;