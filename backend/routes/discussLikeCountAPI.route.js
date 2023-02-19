const express = require("express");
const { client, ObjectId } = require("../commons/common");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.post("/api/like", (req, res) => {

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
                // Error message.
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(timetableAPI.route - 1): " + err);
                };

                const likePostID = parseInt(req.body.likePostID);
                const memberCollection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };

                memberCollection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    // Internal server error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(signinStatusAPI.route - 3): " + err);
                    };

                    // Check whether member has liked the post before.
                    if(checkMemberIDResult){
                        const likeCollection = req.db.collection("like");
                        const checkLikeRecord = {
                            likePostID: likePostID,
                            likeMemberID: memberID
                        };

                        likeCollection.findOne(checkLikeRecord, (err, checkLikeResult) => {

                            if(!checkLikeResult){
                                const likeMemberID = checkMemberIDResult._id.toString();
                                const likeMemberName = checkMemberIDResult.memberName;
            
                                // Record the data insert time.
                                const date = new Date();
                                const offset = 8;
                                const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                                const nd = new Date(utc + (3600000 * offset));
                                const hkTime = new Date(nd.getTime() + (3600000 * offset));
                                const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                                const likeTime = hkTimeString;
            
                                const insertQuery = {
                                    likePostID: likePostID,
                                    likeMemberID: likeMemberID,
                                    likeMemberName: likeMemberName,
                                    likeTime: likeTime
                                };
                        
                                likeCollection.insertOne(insertQuery, (err, insertResult) => {
                                    if(err){
                                        res.status(500).json({"error": true, "message": err.message});
                                        console.log("Error(addDramaAPI.route - 3): " + err);
                                    };
                        
                                    const insertReplyID = insertResult.insertedId.toString();
                                    const checkReplyID = { _id: new ObjectId(insertReplyID) };
                        
                                    likeCollection.findOne(checkReplyID, (err, checkReplyIdResult) => {
                                        // Internal server error message.
                                        if(err){
                                            res.status(500).json({"error": true, "message": err.message});
                                            console.log("Error(signinStatusAPI.route - 3): " + err);
                                        };
                            
                                        if(checkReplyIdResult){
                                            likeCollection.count({ likePostID }, (err, count) => {
                                                // Internal server error message.
                                                if(err){
                                                    res.status(500).json({"error": true, "message": err.message});
                                                    console.log("Error(signinStatusAPI.route - 3): " + err);
                                                };
            
                                                res.status(200).json({"data": count});
                                            });
                                        };
                                    });
                                });
                            }
                            else{
                                // Delete the like count if member has liked before.
                                const deleteQuery = {
                                    likePostID: likePostID,
                                    likeMemberID: memberID
                                };

                                likeCollection.deleteOne(deleteQuery, (err, deleteResult) => {
                                    if(deleteResult){
                                        likeCollection.count({ likePostID }, (err, count) => {
                                            // Internal server error message.
                                            if(err){
                                                res.status(500).json({"error": true, "message": err.message});
                                                console.log("Error(signinStatusAPI.route - 3): " + err);
                                            };
        
                                            res.status(200).json({"data": count});
                                        });
                                    };
                                });
                            };

                        });

                    };

                });
        
            });
        };
    });

});

module.exports = router;