const editDramaPhotoAPIModel = require("../../models/edit/editDramaPhotoAPI.model");
const editDramaInformationAPIModel = require("../../models/edit/editDramaInformationAPI.model");

const model = {

    init: function(req, res){
        const editDramaID = parseInt(req.params.id);
        const editDramaContent = req.body.editDramaContent;
        const updateIndicator = req.body.updateIndicator;
        const uploadPhoto = req.file;
    
        // If the request from user is to update the drama photo.
        if(uploadPhoto != undefined){
            editDramaPhotoAPIModel(req, res, editDramaID, updateIndicator, uploadPhoto);
        };

        // If the request from user is to update the drama information.
        if(uploadPhoto == undefined){
            editDramaInformationAPIModel(req, res, editDramaID, editDramaContent, updateIndicator);
        };
    }

};

module.exports = model.init;