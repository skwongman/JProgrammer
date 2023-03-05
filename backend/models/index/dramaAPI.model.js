const { client } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(dramaAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
    
            const collection = req.db.collection("drama");
            const { dataPerPage, keyword, page, dataOrderPerPage } = commonView.renderVariables(req);
    
            // Join to the drama video link table.
            const dramaDownload = {
                $lookup: {
                    from: "downloadJp",
                    localField: "dramaTitle",
                    foreignField: "downloadTitleChi",
                    as: "dramaDownload"
                }
            };
    
            // Keyword search for dramaTitle, dramaCategory, and dramaWeek.
            let keywordSearch = {};
    
            if(keyword){
                keywordSearch = {
                    $or: [
                        { dramaTitle: { $regex: keyword } },
                        { dramaCategory: { $regex: keyword } },
                        { dramaWeek: { $regex: keyword } }
                    ]
                };
            };
    
            const handleKeywordSearch = { $match: keywordSearch };
    
            // Sortlisting for those fields to be displayed or not.
            const sortlisted = {
                $project: {
                    _id: 0,
                    nextPage: 1,
                    dramaID: 1,
                    dramaTitle: 1,
                    dramaCoverPhoto: 1,
                    dramaCreatedTime: 1,
                    "dramaDownload.downloadID": 1
                }
            };
    
            // Final stage to determine nextPage value
            const nextPage = {
                $facet: {
                    data: [
                        { $sort: { dramaID: 1 } },
                        { $skip: dataOrderPerPage },
                        { $limit: dataPerPage }
                    ],
                    metadata: [
                        { $count: "count" }
                    ]
                }
            };
    
            const aggregatePipeline = [dramaDownload, handleKeywordSearch, sortlisted, nextPage];
    
            // Fetching data
            collection
            .aggregate(aggregatePipeline)
            .toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(dramaAPI.route - 2): " + err;
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