const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

function closeConnection(req, res, next){
    res.on("finish", () => {
        client.close();
    });
    next();
}

router.get("/api/popular", (req, res) => {

    client.connect(err => {

        try{
            const collection = client.db("website").collection("dramaTest");
            const sortlisted = { projection: {_id: 0, dramaTitle: 1, dramaCoverPhoto: 1, dramaViewCount: 1} };

            collection.find({}, sortlisted).limit(6).sort({dramaViewCount: -1}).toArray((err, result) => {
                try{
                    res.status(200).json({"data": result});
                }
                catch(err){
                    res.status(500).json({"error": true, "message": err});
                    console.log("Error(4): " + err);
                }
            });
        }
        catch(err){
            res.status(500).json({"error": true, "message": err});
            console.log("Error(5): " + err);
        };

    }, closeConnection);

});

module.exports = router;