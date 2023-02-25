const { client } = require("../../commons/common");
const commonView = require("../../views/commons/common.view");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(timetableAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
    
            const collection = req.db.collection("drama");
            const sortlisted = { projection: { _id: 0, dramaID: 1, dramaTitle: 1, dramaCoverPhoto: 1, dramaWeek: 1, dramaTimeOfBoardcast: 1 } };
            const filter = { dramaWeek: { $ne: "None" } };
    
            collection.find(filter, sortlisted).toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(timetableAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                if(result){
                    commonView.renderSuccessfulData(result, res);
                    return;
                };
            });
        });
    }

};

module.exports = model.init;