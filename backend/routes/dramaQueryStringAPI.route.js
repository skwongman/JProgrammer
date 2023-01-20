const express = require("express");
const { client } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/drama/:id", (req, res) => {

    client.connect(err => {
        if(err){
            res.status(500).json({"error": true, "message": err.message});
            console.log("Error(dramaQueryStringAPI.route - 1): " + err);
        };
        
        const collection = req.db.collection("dramaTest3");
        const sortlisted = { projection: {_id: 0, dramaDoramaWebLink: 0, dramaAllPhoto: 0, dramaCreatedTime: 0} };
        let id = req.params.id;
        id = parseInt(id);
        
        collection.findOne({dramaID: id}, sortlisted, (err, result) => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(dramaQueryStringAPI.route - 2): " + err);
            };

            if(result == null){
                res.status(400).json({"error": true, "message": "ID not found"});
            }
            else{
                res.status(200).json({"data": result});
            };
        }); 
    });

});

module.exports = router;