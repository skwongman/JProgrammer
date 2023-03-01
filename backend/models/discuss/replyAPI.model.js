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
                        const handledReplyContentText = handledReplyContent.replace('<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>', '')
                        const replyMemberID = checkMemberIDResult._id.toString();
                        const replyMemberName = checkMemberIDResult.memberName;
                        const replyMemberProfilePicture = checkMemberIDResult.memberProfilePicture;
                        const defaultLikeCount = 0;

                        const insertQuery = {
                            replyID: generateIDByTime(),
                            replyPostID: handleReplyPostID,
                            replyDramaTitle: replyDramaTitle,
                            replyContent: handledReplyContentText,
                            replyMemberID: replyMemberID,
                            replyMemberName: replyMemberName,
                            replyMemberProfilePicture: replyMemberProfilePicture,
                            replyLike: defaultLikeCount,
                            replyCreatedTime: generateTimeString()
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