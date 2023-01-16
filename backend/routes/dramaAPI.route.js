const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

router.get('/api/drama', (req, res) => {

    // Test connector
    // client.connect()
    // .then(() => console.log("Connected to MongoDB!"))
    // .catch(err => console.error("Error connecting to MongoDB: " + err));

    const dataPerPage = 10;
    const keyword = req.query.keyword || null;
    let page = req.query.page || 0;
    page = parseInt(page);
    const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-10, Page 1: 11-20, etc.

    // Connect to database and fetch drama API data
    client.connect(err => {

        try{
            const collection = client.db("website").collection("drama");
            const ignoreID = { projection: {_id: 0} };
            let keywordSearch = {};
            // Keyword search for drama_title and drama_category
            if(keyword){
                keywordSearch = {
                    $or: [
                        { drama_title: {$regex: keyword} },
                        { drama_category: {$regex: keyword} }
                    ]
                };
            };
            
            collection.find(keywordSearch, ignoreID).skip(dataOrderPerPage).limit(dataPerPage).toArray((err, result) => {
                try{
                    const nextPage = (result.length + 1 == 11) ? page + 1 : null;
                    res.status(200).json({"nextPage": nextPage, "data": result});
                }
                catch(err){
                    res.status(500).json({"error": true, "message": err});
                    console.log("Error(1): " + err);
                }
                finally{
                    client.close();
                };
            });
        }
        catch(err){
            res.status(500).json({"error": true, "message": err});
            console.log("Error(2): " + err);
        };

    });

});


module.exports = router;