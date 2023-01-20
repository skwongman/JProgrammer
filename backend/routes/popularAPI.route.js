const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/popular", (req, res) => {

    client.connect(err => {
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(popularAPI.route - 1): " + err);
            return;
        };

        const collection = req.db.collection("dramaTest3");
        const sortlisted = { projection: {_id: 0, dramaTitle: 1, dramaCoverPhoto: 1, dramaViewCount: 1} };
        const dramaViewCountDescending = { dramaViewCount: -1 };

        collection.find({}, sortlisted).limit(6).sort(dramaViewCountDescending).toArray((err, result) => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(popularAPI.route - 2): " + err);
            };
            
            res.status(200).json({"data": result});
        });
    });

});

module.exports = router;