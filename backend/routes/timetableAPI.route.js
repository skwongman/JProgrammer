const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/timetable", (req, res) => {

    client.connect(err => {
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(timetableAPI.route - 1): " + err);
        };

        const collection = req.db.collection("dramaTest3");
        const sortlisted = { projection: {_id: 0, dramaTitle: 1, dramaCoverPhoto: 1, dramaWeek: 1, dramaTimeOfBoardcast: 1} };
        const filter = { dramaWeek: {$ne: "None"} };

        collection.find(filter, sortlisted).toArray((err, result) => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(timetableAPI.route - 2): " + err);
            };
            
            res.status(200).json({"data": result});
        });
    });

});

module.exports = router;