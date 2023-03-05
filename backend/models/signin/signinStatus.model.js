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
                if(err){
                    const errorMessage = "Error(signinStatusAPI.route - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, result) => {
                    if(err){
                        const errorMessage = "Error(signinStatusAPI.route - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    if(result){
                        const memberData = {
                            "memberID": result._id.toString(),
                            "memberName": result.memberName,
                            "memberEmail": result.memberEmail,
                            "memberProfilePicture": result.memberProfilePicture
                        };

                        commonView.renderMemberData(res, memberData);
                        return;
                    };
                });
            });
        });
    }

};

module.exports = model.init;