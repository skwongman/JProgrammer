const { client, ObjectId, s3, generateTimeString, generateIDByTime } = require("../../commons/common");
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
                            const handledDiscussContent = discussContent.replace(/blob:https:\/\/[^\/]+\/[^"]+/, discussPhotoURL).split('<img src="blob:https://')[0] + "</p>";
                            const handledDiscussContentText = handledDiscussContent.replace('<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>', '');
                            const discussMemberID = checkMemberIDResult._id.toString();
                            const discussMemberName = checkMemberIDResult.memberName;
                            const discussMemberProfilePicture = checkMemberIDResult.memberProfilePicture;
                            
                            const insertQuery = {
                                discussID: generateIDByTime(),
                                discussPostID: handleDiscussPostID,
                                discussDramaTitle: discussDramaTitle,
                                discussHeader: discussHeader,
                                discussContent: handledDiscussContentText,
                                discussMemberID: discussMemberID,
                                discussMemberName: discussMemberName,
                                discussMemberProfilePicture: discussMemberProfilePicture,
                                discussCreatedTime: generateTimeString()
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