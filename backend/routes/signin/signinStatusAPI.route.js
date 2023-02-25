const express = require("express");
const { client, ObjectId } = require("../../commons/common");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.get("/api/user/auth", (req, res) => {

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
                    console.log("Error(signinStatusAPI.route - 2): " + err);
                };
        
                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, result) => {
                    // Internal server error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(signinStatusAPI.route - 3): " + err);
                    };
        
                    // Return user data.
                    const data = {
                        "memberID": result._id.toString(),
                        "memberName": result.memberName,
                        "memberEmail": result.memberEmail,
                        "memberProfilePicture": result.memberProfilePicture
                    };

                    res.status(200).json({"data": data});
                });
            });            
        };
    });

});

module.exports = router;