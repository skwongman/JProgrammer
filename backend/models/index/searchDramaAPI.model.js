const { client } = require("../../commons/common");
const commonView = require("../../views/commons/common.view");

const model = {

    init: function(req, res){
        const keyword = req.query.keyword; // User input from frontend side.
        const keywordRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\a-z\d]{1,20}/; // Use regex to verify the user input.

        // If the regex is invalid.
        if(!keyword.match(keywordRegex)){
            commonView.renderIncorrectFormat(res);
            return;
        };

        // if the regex is valid.
        // Connect to database and fetch drama API data
        client.connect(err => {
            if(err){
                const errorMessage = "Error(searchDramaAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };

            const collection = req.db.collection("drama");
            const maxNoOfResult = 5; // Max no. of results in the search menu.

            // Keyword search
            let keywordSearch = {};
            if(keyword){
                keywordSearch = {
                    $or: [
                        { dramaTitle: { $regex: keyword } }
                    ]
                };
            };
            const handleKeywordSearch = { $match: keywordSearch };

            const sortlisted = {
                $project: {
                    _id: 0,
                    dramaID: 1,
                    dramaTitle: 1
                }
            };

            const aggregatePipeline = [handleKeywordSearch, sortlisted];
            
            // Fetching data
            collection
            .aggregate(aggregatePipeline)
            .limit(maxNoOfResult)
            .toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(searchDramaAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                if(result.length == 0){
                    commonView.renderDataNotFound(res);
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