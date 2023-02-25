const express = require("express");
const { client } = require("../../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/search", (req, res) => {

    // User input from frontend side.
    const keyword = req.query.keyword;

    // Use regex to verify the user input.
    const keywordRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\a-z\d]{1,20}/;

    // Max no. of results in the search menu.
    const maxNoOfResult = 5;

    // If the regex is invalid.
    if(!keyword.match(keywordRegex)){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    }
    // if the regex is valid.
    else{
        // Connect to database and fetch drama API data
        client.connect(err => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(searchDramaAPI.route - 1): " + err);
                return;
            };

            const collection = req.db.collection("drama");

            // Keyword search
            let keywordSearch = {};
            if(keyword){
                keywordSearch = {
                    $or: [
                        { dramaTitle: {$regex: keyword} }
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
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(searchDramaAPI.route - 1): " + err);
                    return;
                };

                if(result == 0){
                    res.status(400).json({"error": true, "message": "not found"});
                }
                else{
                    const data = result;

                    res.status(200).json({"data": data });
                };
            });
        });
    };

});

module.exports = router;