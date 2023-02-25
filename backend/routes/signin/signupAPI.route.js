const express = require("express");
const { client } = require("../../commons/common");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.post("/api/user", (req, res) => {

    // User input from frontend side.
    const signupName = req.body.name;
    const signupEmail = req.body.email;
    const signupPassword = req.body.password;

    // Use regex to verify the user input.
    const nameRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\a-z\d]{1,20}/;
    const emailRegex = /^([\w-]+)@([a-z\d-]+)\.([a-z]{2,8})([\.a-z]{2,8})?$/;
    const passwordRegex = /^[\w`~!@#$%^&*()=+-]{8,20}$/;

    // If the regex is invalid.
    if(!signupName.match(nameRegex) || !signupEmail.match(emailRegex) || !signupPassword.match(passwordRegex)){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    }
    // if the regex is valid.
    else{
        client.connect(err => {
            // Internal server error message.
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(signupAPI.route - 1): " + err);
            };
    
            // Check whether the user input email has been registerd in the database.
            const collection = req.db.collection("member");
            const checkEmail = { memberEmail: signupEmail };
    
            collection.findOne(checkEmail, (err, result) => {
                // Internal server error message.
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(signupAPI.route - 2): " + err);
                };
    
                // If email is found.
                if(result != null){
                    res.status(400).json({"error": true, "message": "This email has been registered"});
                }
                // If email is not found.
                else{
                    // Hashing the user password before inserting into the database.
                    const saltRounds = 10;
    
                    bcrypt.hash(signupPassword, saltRounds, (err, hashedPassword) => {
                        const insertQuery = {
                            memberEmail: signupEmail,
                            memberName: signupName,
                            memberPassword: hashedPassword,
                            memberProfilePicture: "https://d11c6b10livv50.cloudfront.net/icon_profile.png"
                        };
    
                        collection.insertOne(insertQuery, (err) => {
                            if(err){
                                res.status(500).json({"error": true, "message": err.message});
                                console.log("Error(signupAPI.route - 3): " + err);
                            };

                            res.status(200).json({"ok": true});
                        });
                    });
                };
            });
        });    
    };

});

module.exports = router;