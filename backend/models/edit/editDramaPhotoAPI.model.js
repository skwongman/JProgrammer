const { client, s3 } = require("../../commons/common");
const fs = require("fs");
const { getAverageColor } = require("fast-average-color-node");
const commomView = require("../../views/common.view");

const model = {

    init: function(req, res, editDramaID, updateIndicator, uploadPhoto){
        const { photoExtension, matchTypeOfPhoto, meetPhotoUploadSize } = commomView.renderPhotoUpload(req);

        if(!matchTypeOfPhoto){
            commomView.renderTypeOfPhoto(res);
            return;
        };

        if(!meetPhotoUploadSize){
            commomView.renderPhotoUploadSize(res);
            return;
        };
    
        // AWS S3 upload setting.
        const params = commomView.renderAWS(photoExtension, uploadPhoto, fs);

        // Upload drama cover photo.
        s3.upload(params, (err, data) => {
            client.connect(err => {
                if(err){
                    const errorMessage = "Error(editDramaPhotoAPI.model - 1): " + err;
                    commomView.renderError(err, res, errorMessage);
                    return;
                };
        
                const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                const addDramaCoverPhotoName = data.Location.split("/").pop();
                const addDramaCoverPhotoURL = CdnURL + addDramaCoverPhotoName;
                const collection = req.db.collection("drama2");
                const insertQuery = { dramaID: editDramaID };
                let insertValue = null;

                if(updateIndicator == "edit7"){
                    insertValue = { $set: { dramaCoverPhoto: addDramaCoverPhotoURL } };
                };
        
                collection.updateOne(insertQuery, insertValue, (err, result) => {
                    if(err){
                        const errorMessage = "Error(editDramaPhotoAPI.model - 2): " + err;
                        commomView.renderError(err, res, errorMessage);
                        return;
                    };

                    if(result){
                        collection.findOne({dramaID: editDramaID}, (err, editResult) => {
                            if(err){
                                const errorMessage = "Error(editDramaPhotoAPI.model - 3): " + err;
                                commomView.renderError(err, res, errorMessage);
                                return;
                            };

                            if(editResult){
                                commomView.renderEditPhoto(res, getAverageColor, addDramaCoverPhotoURL, updateIndicator, editResult);
                                return;
                            };
                        });
                    };
                });
            });
        });
    }

};

module.exports = model.init;