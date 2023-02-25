const { client } = require("../../commons/common");
const commonView = require("../../views/commons/common.view");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(popularAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
    
            const collection = req.db.collection("drama");
            const sortlisted = { projection: { _id: 0, dramaID: 1, dramaTitle: 1, dramaCoverPhoto: 1, dramaViewCount: 1 } };
            const dramaViewCountDescending = { dramaViewCount: -1 };
    
            collection.find({}, sortlisted).limit(6).sort(dramaViewCountDescending).toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(popularAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                if(result){
                    commonView.renderSuccessful(result, res);
                    return;
                };
            });
        });
    }

};

module.exports = model.init;