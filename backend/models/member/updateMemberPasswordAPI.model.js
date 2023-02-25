const { client, ObjectId } = require("../../commons/common");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
            const { updatePassword, passwordRegex } = commonView.renderUserInput(req);

            // If the regex is invalid.
            if(!updatePassword.match(passwordRegex)){
                commonView.renderIncorrectFormat(res);
                return;
            };

            // if the regex is valid.
            client.connect(err => {
                // Internal server error message.
                if(err){
                    const errorMessage = "Error(updateMemberPasswordAPI.route - 1): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };
        
                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    // Internal server error message.
                    if(err){
                        const errorMessage = "Error(updateMemberPasswordAPI.route - 2): " + err;
                        commonView.renderError(err, res, errorMessage);
                        return;
                    };

                    if(checkMemberIDResult){
                        const saltRounds = 10;
        
                        bcrypt.hash(updatePassword, saltRounds, (err, hashedPassword) => {
                            const insertQuery = checkMemberID;
                            const insertValue = { $set: { memberPassword: hashedPassword } };

                            collection.updateOne(insertQuery, insertValue, (err, updatePasswordResult) => {
                                if(err){
                                    const errorMessage = "Error(updateMemberPasswordAPI.route - 3): " + err;
                                    commonView.renderError(err, res, errorMessage);
                                    return;
                                };

                                if(updatePasswordResult){
                                    collection.findOne(checkMemberID, (err, passwordResult) => {
                                        if(err){
                                            const errorMessage = "Error(updateMemberPasswordAPI.route - 4): " + err;
                                            commonView.renderError(err, res, errorMessage);
                                            return;
                                        };

                                        if(passwordResult){
                                            commonView.renderSuccessful(res);
                                            return;
                                        };
                                    });
                                };
                            });
                        });
                    };
                });
            });
        });
    }

};

module.exports = model.init;