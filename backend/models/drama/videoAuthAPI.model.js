const { client, ObjectId } = require("../../commons/common");
const commonView = require("../../views/common.view");
const jwt = require("jsonwebtoken");

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
                // Internal server error message.
                if(err){
                    const errorMessage = "Error(watchDramaAccessAPI.route - 1): " + err;
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
                        const errorMessage = "Error(watchDramaAccessAPI.route - 3): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    // Compare with the member id whether it is the testing account member id.
                    const testAccountID = "63e76017fdc1e54772c8c140";
                    
                    if(result._id.toString() != testAccountID){
                        commonView.renderVideoAuth(res);
                        return;
                    };

                    if(result){
                        commonView.renderSuccessful(res);
                        return;
                    };
                });
            });
        });
    }

};

module.exports = model.init;