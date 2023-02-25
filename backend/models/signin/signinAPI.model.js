const { client } = require("../../commons/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const commonView = require("../../views/common.view");

const model = {

    init: function(req, res){
        // User input from frontend side.
        const { signupEmail, signupPassword, emailRegex, passwordRegex } = commonView.renderUserInput(req);

        // If the regex is invalid.
        if(!signupEmail.match(emailRegex) || !signupPassword.match(passwordRegex)){
            commonView.renderIncorrectFormat(res);
            return;
        };
        
        // if the regex is valid.
        client.connect(err => {
            // Internal server error message.
            if(err){
                errorMessage = "Error(signinAPI.route - 1): " + err;
                commonView.renderError(err, res, errorMessage);
                return;
            };

            // Check whether the user input email has been registerd in the database.
            const collection = req.db.collection("member");
            const checkEmail = { memberEmail: signupEmail };

            collection.findOne(checkEmail, (err, result) => {
                // Internal server error message.
                if(err){
                    errorMessage = "Error(signinAPI.route - 2): " + err;
                    commonView.renderError(err, res, errorMessage);
                    return;
                };

                // If email is not found.
                if(result == null){
                    commonView.renderEmailNotFound(res);
                    return;
                };

                if(result){
                    // If email is found.
                    bcrypt.compare(signupPassword, result.memberPassword, (err, match) => {
                        // Internal server error message.
                        if(err){
                            errorMessage = "Error(signinAPI.route - 3): " + err;
                            commonView.renderError(err, res, errorMessage);
                            return;
                        };

                        // If the user input password is "not match" with the encrypted password in the database.
                        if(!match){
                            commonView.renderEmailIncorrect(res);
                            return;
                        };

                        // If the user input password is "match" with the encrypted password in the database.
                        if(match){
                            commonView.renderJWTCookie(res, result, jwt)
                            commonView.renderSuccessful(res);
                            return;
                        };
                    });
                };            
            });
        });
    }

};

module.exports = model.init;