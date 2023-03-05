const { client } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(popularAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
    
            const collection = req.db.collection("drama");
            const { dataPerPage, page, dataOrderPerPage } = commonView.renderVariables(req);
    
            const sortlisted = {
                $project: {
                    _id: 0,
                    nextPage: 1,
                    dramaID: 1,
                    dramaTitle: 1,
                    dramaCoverPhoto: 1,
                    dramaViewCount: 1,
                    dramaCreatedTime: 1
                }
            };
    
            // Final stage to determine nextPage value
            const nextPage = {
                $facet: {
                    data: [
                        { $sort: { dramaViewCount: -1 } },
                        { $skip: dataOrderPerPage },
                        { $limit: dataPerPage }
                    ],
                    metadata: [
                        { $count: "count" }
                    ]
                }
            };
    
            const aggregatePipeline = [sortlisted, nextPage];
            
            // Fetching data
            collection
            .aggregate(aggregatePipeline)
            .toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(popularAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                if(result){
                    commonView.renderDramaData(result, res, dataOrderPerPage, dataPerPage, page);
                    return;
                };
            }); 
        });
    }

};

module.exports = model.init;