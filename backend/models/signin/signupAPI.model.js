const { client } = require("../../commons/common");
const bcrypt = require("bcryptjs");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        // User input from frontend side.
        const { signupName, signupEmail, signupPassword, nameRegex, emailRegex, passwordRegex } = commonView.renderUserInput(req);

        // If the regex is invalid.
        if(!signupName.match(nameRegex) || !signupEmail.match(emailRegex) || !signupPassword.match(passwordRegex)){
            commonView.renderIncorrectFormat(res);
            return;
        };

        // if the regex is valid.
        client.connect(err => {
            // Internal server error message.
            if(err){
                errorMessage = "Error(signupAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };

            // Check whether the user input email has been registerd in the database.
            const collection = req.db.collection("member");
            const checkEmail = { memberEmail: signupEmail };

            collection.findOne(checkEmail, (err, result) => {
                // Internal server error message.
                if(err){
                    errorMessage = "Error(signupAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                // If email is found.
                if(result){
                    commonView.renderEmailRegistered(res);
                    return;
                };

                // If email is not found.
                if(!result){
                    // Hashing the user password before inserting into the database.
                    const saltRounds = 10;

                    bcrypt.hash(signupPassword, saltRounds, (err, hashedPassword) => {
                        const insertQuery = {
                            memberEmail: signupEmail,
                            memberName: signupName,
                            memberPassword: hashedPassword,
                            memberProfilePicture: "https://d11c6b10livv50.cloudfront.net/icon_profile.png"
                        };

                        collection.insertOne(insertQuery, (err, result) => {
                            if(err){
                                errorMessage = "Error(signupAPI.route - 3): " + err;
                                commonView.renderError(err, res, errorMessage);
                                return;
                            };

                            if(result){
                                commonView.renderSuccessful(res);
                                return;
                            };
                        });
                    });
                };
            });
        });
    }

};

module.exports = model.init;