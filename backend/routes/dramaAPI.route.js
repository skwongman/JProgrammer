const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/drama", (req, res) => {

    const dataPerPage = 6;
    const keyword = req.query.keyword || null;
    let page = req.query.page || 0;
    page = parseInt(page);
    const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-10, Page 1: 11-20, etc.

    // Connect to database and fetch drama API data
    client.connect(err => {
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(dramaAPI.route - 1): " + err);
            return;
        };

        const collection = req.db.collection("dramaTest3");
        const sortlisted = { projection: {_id: 0, dramaDoramaWebLink: 0, dramaAllPhoto: 0, dramaCreatedTime: 0} };
        let keywordSearch = {};
        // Keyword search for drama_title and drama_category
        if(keyword){
            keywordSearch = {
                $or: [
                    { dramaTitle: {$regex: keyword} },
                    { dramaCategory: {$regex: keyword} },
                    { dramaWeek: {$regex: keyword} }
                ]
            };
        };
        
        collection.find(keywordSearch, sortlisted).skip(dataOrderPerPage).limit(dataPerPage).toArray((err, result) => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(dramaAPI.route - 2): " + err);
                return;
            };

            const nextPage = (result.length + 1 == 7) ? page + 1 : null;
            res.status(200).json({"nextPage": nextPage, "data": result});
        }); 
    });

});

module.exports = router;