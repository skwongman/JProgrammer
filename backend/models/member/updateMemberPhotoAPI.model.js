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
            client.connect(err => {
                // Internal server error message.
                if(err){
                    const errorMessage = "Error(updateMemberPhotoAPI.route - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    // Internal server error message.
                    if(err){
                        const errorMessage = "Error(updateMemberPhotoAPI.route - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    if(checkMemberIDResult){
                        // Retrieve the drama photo data from the frontend side.
                        const { updateProfilePhoto, photoExtension, matchTypeOfPhoto, meetPhotoUploadSize } = commonView.renderPhotoUpload(req);

                        if(!matchTypeOfPhoto){
                            commonView.renderTypeOfPhoto(res);
                            return;
                        };

                        if(!meetPhotoUploadSize){
                            commonView.renderPhotoUploadSize(res);
                            return;
                        };

                        // AWS S3 upload setting.
                        const params = commonView.renderAWS(photoExtension, updateProfilePhoto, fs);
                    
                        // Upload profile photo.
                        s3.upload(params, (err, data) => {
                            // Upload error message.
                            if(err){
                                const errorMessage = "Error(updateMemberPhotoAPI.route - 3): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };
                    
                            const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                            const updatePhotoName = data.Location.split("/").pop();
                            const updatePhotoURL = CdnURL + updatePhotoName;

                            // Assign name for each item.
                            const insertQuery = checkMemberID;
                            const insertValue = { $set: { memberProfilePicture: updatePhotoURL } };

                            collection.updateOne(insertQuery, insertValue, (err, updatePhotoResult) => {
                                if(err){
                                    const errorMessage = "Error(updateMemberPhotoAPI.route - 4): " + err;
                                    commonView.renderError(err, res, errorMessage);
                                    return;
                                };

                                if(updatePhotoResult){
                                    collection.findOne(checkMemberID, (err, photoLinkResult) => {
                                        if(err){
                                            const errorMessage = "Error(updateMemberPhotoAPI.route - 5): " + err;
                                            commonView.renderError(err, res, errorMessage);
                                            return;
                                        };

                                        if(photoLinkResult){
                                            commonView.renderPhotoUploadSuccessful(res, photoLinkResult);
                                            return;
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