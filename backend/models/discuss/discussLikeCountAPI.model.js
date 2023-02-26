const { client, ObjectId, generateTimeString } = require("../../commons/common");
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
                // Error message.
                if(err){
                    const errorMessage = "Error(discussLikeCountAPI.model - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                const likePostID = parseInt(req.body.likePostID);
                const memberCollection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };

                memberCollection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    // Internal server error message.
                    if(err){
                        const errorMessage = "Error(discussLikeCountAPI.model - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    // Check whether member has liked the post before.
                    if(checkMemberIDResult){
                        const likeCollection = req.db.collection("like");
                        const checkLikeRecord = {
                            likePostID: likePostID,
                            likeMemberID: memberID
                        };

                        likeCollection.findOne(checkLikeRecord, (err, checkLikeResult) => {
                            // Internal server error message.
                            if(err){
                                const errorMessage = "Error(discussLikeCountAPI.model - 3): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };

                            // If the post was not liked by member before, add the like count.
                            if(!checkLikeResult){
                                const likeMemberID = checkMemberIDResult._id.toString();
                                const likeMemberName = checkMemberIDResult.memberName;
            
                                const insertQuery = {
                                    likePostID: likePostID,
                                    likeMemberID: likeMemberID,
                                    likeMemberName: likeMemberName,
                                    likeTime: generateTimeString()
                                };
                        
                                likeCollection.insertOne(insertQuery, (err, insertResult) => {
                                    if(err){
                                        const errorMessage = "Error(discussLikeCountAPI.model - 4): " + err;
                                        commonView.renderError(err, res, errorMessage);
                                        return;
                                    };
                        
                                    const insertReplyID = insertResult.insertedId.toString();
                                    const checkReplyID = { _id: new ObjectId(insertReplyID) };
                        
                                    likeCollection.findOne(checkReplyID, (err, checkReplyIdResult) => {
                                        // Internal server error message.
                                        if(err){
                                            const errorMessage = "Error(discussLikeCountAPI.model - 5): " + err;
                                            commonView.renderError(err, res, errorMessage);
                                            return;
                                        };
                            
                                        if(checkReplyIdResult){
                                            likeCollection.count({ likePostID }, (err, result) => {
                                                // Internal server error message.
                                                if(err){
                                                    const errorMessage = "Error(discussLikeCountAPI.model - 6): " + err;
                                                    commonView.renderError(err, res, errorMessage);
                                                    return;
                                                };
            
                                                commonView.renderSuccessfulData(result, res);
                                                return;
                                            });
                                        };
                                    });
                                });
                            };

                            // If the post was liked by member before, delete the like count.
                            if(checkLikeResult){
                                const deleteQuery = {
                                    likePostID: likePostID,
                                    likeMemberID: memberID
                                };

                                likeCollection.deleteOne(deleteQuery, (err, deleteResult) => {
                                    // Internal server error message.
                                    if(err){
                                        res.status(500).json({"error": true, "message": err.message});
                                        console.log("Error(signinStatusAPI.route - 3): " + err);
                                        return;
                                    };

                                    if(deleteResult){
                                        likeCollection.count({ likePostID }, (err, count) => {
                                            // Internal server error message.
                                            if(err){
                                                res.status(500).json({"error": true, "message": err.message});
                                                console.log("Error(signinStatusAPI.route - 3): " + err);
                                                return;
                                            };

                                            res.status(200).json({"data": count});
                                            return;
                                        });
                                    };
                                });
                            };
                        });
                    };
                });
            });
        });
    }

};

module.exports = model.init;