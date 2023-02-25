const express = require("express");
const { client, ObjectId } = require("../../commons/common");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.put("/api/chat/history/:id", (req, res) => {


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
                // Error handling
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(chatHistoryAPI.route): " + err);
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
        
                    if(result){
                        // Assign names
                        const id = req.params.id;
                        const chatCollection = req.db.collection("chat");
                        const matchDramaID = { $match: { chatRoomID: id } };
                
                        const aggreMember = {
                            $lookup:
                            {
                                from: "member",
                                let: { pid: "$chatSenderID" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", { $toObjectId: "$$pid" }]
                                            }
                                        }
                                    }
                                ],
                                as: "chatSenderID"
                            }
                        };
                
                        const sortlisted = {
                            $project: {
                                _id: 0,
                                chatRoomID: 0,
                                chatReceiverID: 0,
                                "chatSenderID._id": 0,
                                "chatSenderID.memberEmail": 0,
                                "chatSenderID.memberPassword": 0
                            }
                        };
                
                        const groupByDate = {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$chatCreatedTime" } },
                                chats: { $push: "$$ROOT" }
                            }
                        };
                
                        const sorting = {
                            $sort: {
                                "chats.chatCreatedTime": 1
                            }
                        };
                
                        const aggregatePipeline = [matchDramaID, aggreMember, sortlisted, groupByDate, sorting];
                
                        // Fetching data
                        chatCollection
                        .aggregate(aggregatePipeline)
                        .toArray((err, result) => {
                            if(err){
                                res.status(500).json({"error": true, "message": err.message});
                                console.log("Error(chatHistoryAPI.route): " + err);
                            };
                
                            if(result == ""){
                                res.status(400).json({"error": true, "message": "ID not found"});
                            }
                            else if(result){
                                res.status(200).json({"data": result});
                            };
                        });
                    };
                });

            });
        };
    });

});

module.exports = router;