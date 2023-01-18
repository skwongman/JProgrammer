const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();


// let activeConnections = 0;

// Connect to the MongoDB server
// client.connect()
// .then(() => {
//     console.log("Connected to MongoDB!");
//     activeConnections++;
//     console.log(`Active connections: ${activeConnections}`);
// })
// .catch(err => console.error("Error connecting to MongoDB: " + err));


// Release the connection
function closeConnection(req, res, next){
    res.on("finish", () => {
        client.close();
    });
    next();
}


router.get("/api/drama", (req, res) => {

    const dataPerPage = 6;
    const keyword = req.query.keyword || null;
    let page = req.query.page || 0;
    page = parseInt(page);
    const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-10, Page 1: 11-20, etc.

    // Connect to database and fetch drama API data
    client.connect(err => {

        try{
            const collection = client.db("website").collection("dramaTest");
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
                try{
                    const nextPage = (result.length + 1 == 7) ? page + 1 : null;
                    res.status(200).json({"nextPage": nextPage, "data": result});
                }
                catch(err){
                    res.status(500).json({"error": true, "message": err});
                    console.log("Error(1): " + err);
                };
            }); 
        }
        catch(err){
            res.status(500).json({"error": true, "message": err});
            console.log("Error(2): " + err);
        };

    });

}, closeConnection);

module.exports = router;