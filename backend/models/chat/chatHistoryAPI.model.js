const { client, ObjectId } = require("../../commons/common");
const jwt = require("jsonwebtoken");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        // Decode the member id from JWT of cookie.
        const token = req.cookies.token;
        const secretKey = process.env.JWT_SECRET_KEY;

        jwt.verify(token, secretKey, (err, decoded) => {
            // If the decode is not successful.
            if(decoded == undefined){
                commonView.renderForbidden(res);
                return;
            };

            // If the decode is successful.
            client.connect(err => {
                // Error handling
                if(err){
                    const errorMessage = "Error(chatHistoryAPI.route - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, result) => {
                    // Internal server error message.
                    if(err){
                        const errorMessage = "Error(chatHistoryAPI.route - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };
        
                    if(result){
                        // Assign names
                        const id = req.params.id;
                        const chatCollection = req.db.collection("chat");
                        const matchChatRoomID = { $match: { chatRoomID: id } };
                
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
                
                        const aggregatePipeline = [matchChatRoomID, aggreMember, sortlisted, groupByDate, sorting];
                
                        // Fetching data
                        chatCollection
                        .aggregate(aggregatePipeline)
                        .toArray((err, result) => {
                            if(err){
                                const errorMessage = "Error(chatHistoryAPI.route - 3): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };
                
                            if(result == ""){
                                commonView.renderDataNotFound(res);
                                return;
                            };

                            if(result){
                                commonView.renderSuccessfulData(result, res);
                                return;
                            };
                        });
                    };
                });
            });
        });
    }

};

module.exports = model.init;