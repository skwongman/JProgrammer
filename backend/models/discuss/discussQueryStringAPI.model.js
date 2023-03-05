const { client } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        client.connect(err => {
            if(err){
                const errorMessage = "Error(discussQueryStringAPI.model - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };
            
            const id = parseInt(req.params.id);
            const page = parseInt(req.query.page) || 1; // default page is 1
            const limit = 9; // number of records to show per page (not including the first post)
            const skip = (page - 1) * limit;
            const collection = req.db.collection("discuss");
            const matchDramaID = { $match: { discussPostID: id } };
    
            const aggrePost = {
                $lookup: {
                    from: "reply",
                    localField: "discussPostID",
                    foreignField: "replyPostID",
                    as: "discussReply"
                }
            };
            
            const aggreMemberPost = {
                $lookup:
                {
                    from: "member",
                    let: { pid: "$discussMemberID" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", { $toObjectId: "$$pid" }]
                                }
                            }
                        }
                    ],
                    as: "discussMemberID"
                }
            };
    
            const aggreMemberReply = {
                $lookup: {
                    from: "member",
                    let: {
                        memberIds: { $map: { input: "$discussReply.replyMemberID", as: "id", in: { $toObjectId: "$$id" } } }
                    },
                    pipeline: [
                        { $match: { $expr: { $in: [ "$_id", "$$memberIds" ] } } }
                    ],
                    as: "replyMemberID"
                }
            };
    
            const aggreLikePost = {
                $lookup: {
                    from: "like",
                    localField: "discussID",
                    foreignField: "likePostID",
                    as: "likePostCount"
                }
            };
    
            const aggreLikeReply = {
                $lookup: {
                    from: "like",
                    localField: "discussReply.replyID",
                    foreignField: "likePostID",
                    as: "likeReplyCount"
                }
            };
            
            const excludeFields = {
                $project: {
                    _id: 0,
                    discussMemberName: 0,
                    discussMemberProfilePicture: 0,
                    "discussReply._id": 0,
                    "discussReply.replyDramaTitle": 0,
                    "discussReply.replyMemberName": 0,
                    "discussReply.replyMemberProfilePicture": 0,
                    "discussMemberID.memberEmail": 0,
                    "discussMemberID.memberPassword": 0
                }
            };
            
            const countReply = { $addFields: { count: { $size: "$discussReply" } } };
            
            const addIndex = {
                $addFields: {
                    discussReply: {
                        $map: {
                            input: "$discussReply",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    { replyNo: { $add: [{ $indexOfArray: ["$discussReply", "$$reply"] }, 1 + 1] } }
                                ]
                            }
                        }
                    }
                }
            };
            
            const addReplyLike = {
                $addFields: {
                    discussReply: {
                        $map: {
                            input: "$discussReply",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    {
                                        likeReplyCount: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$likeReplyCount",
                                                        as: "like",
                                                        cond: {
                                                            $eq: ["$$like.likePostID", "$$reply.replyID"]
                                                        }
                                                    }
                                                },
                                                as: "like",
                                                in: {
                                                    likeMemberName: "$$like.likeMemberName"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            };
    
            const addMemberReply = {
                $addFields: {
                    discussReply: {
                        $map: {
                            input: "$discussReply",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    {
                                        replyMemberID: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: "$replyMemberID",
                                                        as: "member",
                                                        cond: {
                                                            $eq: [
                                                                { $toObjectId: "$$member._id" },
                                                                { $toObjectId: "$$reply.replyMemberID" }
                                                            ]
                                                        }
                                                    }
                                                },
                                                as: "member",
                                                in: {
                                                    memberID: "$$member._id",
                                                    memberName: "$$member.memberName",
                                                    memberProfilePicture: "$$member.memberProfilePicture"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            };
            
            const sliceReply = {
                $project: {
                    discussReply: { $slice: ["$discussReply", skip, limit] },
                    count: 1,
                    discussID: 1,
                    discussPostID: 1,
                    discussDramaTitle: 1,
                    discussHeader: 1,
                    discussContent: 1,
                    discussMemberID: 1,
                    discussMemberName: 1,
                    discussMemberProfilePicture: 1,
                    likePostCount: 1,
                    discussCreatedTime: 1
                }
            };
            
            const aggregatePipeline = [matchDramaID, aggrePost, aggreMemberPost, aggreMemberReply, excludeFields, countReply, addIndex, aggreLikeReply, aggreLikePost, addReplyLike, addMemberReply, sliceReply];
            
            // Fetching data
            collection.aggregate(aggregatePipeline).toArray((err, result) => {
                if(err){
                    const errorMessage = "Error(discussQueryStringAPI.model - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
            
                if(result.length == 0){
                    commonView.renderDataNotFound(res);
                    return;
                };

                if(result){
                    commonView.renderDiscussVariables(res, result, skip, limit, page);
                    return;
                };
            });
        });
    }

};

module.exports = model.init;