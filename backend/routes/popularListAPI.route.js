const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/popular/list", (req, res) => {

    const dataPerPage = 8;
    let page = req.query.page || 0;
    page = parseInt(page);
    const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-10, Page 1: 11-20, etc.

    // Connect to database and fetch drama API data
    client.connect(err => {
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(popularListAPI.route - 1): " + err);
            return;
        };

        const collection = req.db.collection("drama2");

        // const popularDescendingOrder = {
        //     $sort: { dramaViewCount: -1 }
        // };

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
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(popularListAPI.route - 1): " + err);
                return;
            };

            // Determine nextPage value.
            const data = result[0].data;
            const count = result[0].metadata[0].count;
            const nextPage = (count > dataOrderPerPage + dataPerPage) ? page + 1 : null;
            // Determine the total pages.
            const totalPages = Math.ceil(count / dataPerPage);

            res.status(200).json({"totalPages": totalPages, "nextPage": nextPage, "data": data });
        }); 
    });

});

module.exports = router;