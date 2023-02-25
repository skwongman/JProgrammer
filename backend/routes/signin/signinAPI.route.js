const express = require("express");
const { client } = require("../../commons/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();


// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.put("/api/user/auth", (req, res) => {

    // User input from frontend side.
    const signupEmail = req.body.email;
    const signupPassword = req.body.password;

    // Use regex to verify the user input.
    const emailRegex = /^([\w-]+)@([a-z\d-]+)\.([a-z]{2,8})([\.a-z]{2,8})?$/;
    const passwordRegex = /^[\w`~!@#$%^&*()=+-]{8,20}$/;

    // If the regex is invalid.
    if(!signupEmail.match(emailRegex) || !signupPassword.match(passwordRegex)){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    }
    // if the regex is valid.
    else{
        client.connect(err => {
            // Internal server error message.
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(signinAPI.route - 1): " + err);
            };
    
            // Check whether the user input email has been registerd in the database.
            const collection = req.db.collection("member");
            const checkEmail = { memberEmail: signupEmail };
    
            collection.findOne(checkEmail, (err, result) => {
                // Internal server error message.
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(signinAPI.route - 2): " + err);
                };
    
                // If email is not found.
                if(result == null){
                    res.status(400).json({"error": true, "message": "The email is not found"});
                }
                // If email is found.
                else{
                    bcrypt.compare(signupPassword, result.memberPassword, (err, match) => {
                        // Internal server error message.
                        if(err){
                            res.status(500).json({"error": true, "message": err.message});
                            console.log("Error(signinAPI.route - 3): " + err);
                        };

                        // If the user input password is "not match" with the encrypted password in the database.
                        if(!match){
                            res.status(400).json({"error": true, "message": "The email or password is not correct"});
                        }
                        // If the user input password is "match" with the encrypted password in the database.
                        else{
                            // Create JWT with member id.
                            const secretKey = process.env.JWT_SECRET_KEY;
                            const memberID = result._id.toString();
                            const token = jwt.sign({memberID}, secretKey);

                            // Use cookie to wrap the JWT.
                            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                            const expiryDate = new Date(Date.now() + thirtyDaysInMs);
                            res.cookie("token", token, {expires: expiryDate, httpOnly: false, secure: true, sameSite: true });

                            // Return true if login is successful.
                            res.status(200).json({"ok": true});
                        };
                    });
                };
            });
        });    
    };

});

module.exports = router;