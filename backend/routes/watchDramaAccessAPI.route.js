const express = require("express");
const { client, ObjectId } = require("../commons/common");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/video/auth", (req, res) => {

    // Decode the member id from JWT of cookie.
    const token = req.cookies.token;
    const secretKey = process.env.JWT_SECRET_KEY;

    jwt.verify(token, secretKey, (err, decoded) => {
        // If the decode is not successful.
        if(decoded == undefined){
            res.status(403).json({"error": true, "message": "forbidden"});
        }
        // If the decode is successful.
        else{
            client.connect(err => {
                // Internal server error message.
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(watchDramaAccessAPI.route - 1): " + err);
                };
        
                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, result) => {
                    // Internal server error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(watchDramaAccessAPI.route - 2): " + err);
                    }
                    // Compare with the member id whether it is the testing account member id.
                    else if(result._id.toString() != "63da56f1ce2055b9fb0d9721"){
                        res.status(403).json({"error": true, "message": "forbidden"});
                    }
                    else{
                        res.status(200).json({"ok": true});
                    };
                });
            });            
        };
    });

});

module.exports = router;