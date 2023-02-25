const express = require("express");
const { client, ObjectId } = require("../../commons/common");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.put("/api/member/password", (req, res) => {

    // Decode the member id from JWT of cookie.
    const token = req.cookies.token;
    const secretKey = process.env.JWT_SECRET_KEY;

    jwt.verify(token, secretKey, (err, decoded) => {
        // If the decode is not successful.
        if(decoded == undefined){
            res.status(403).json({"error": true, "message": "forbidden"});
        }
        // If the decode is successful.
        else{
            const updatePassword = req.body.updatePassword;
            const passwordRegex = /^[\w`~!@#$%^&*()=+-]{8,20}$/;

            // If the regex is invalid.
            if(!updatePassword.match(passwordRegex)){
                res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
            }
            // if the regex is valid.
            else{
                client.connect(err => {
                    // Internal server error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(updateMemberPhotoAPI.route - 1): " + err);
                    };
            
                    // Fetching user data from database.
                    const collection = req.db.collection("member");
                    const memberID = decoded.memberID;
                    const checkMemberID = { _id: new ObjectId(memberID) };
            
                    collection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                        // Internal server error message.
                        if(err){
                            res.status(500).json({"error": true, "message": err.message});
                            console.log("Error(updateMemberPhotoAPI.route - 2): " + err);
                        };
    
                        if(checkMemberIDResult){
                            const saltRounds = 10;
            
                            bcrypt.hash(updatePassword, saltRounds, (err, hashedPassword) => {
                                const insertQuery = checkMemberID;
                                const insertValue = { $set: { memberPassword: hashedPassword } };
    
                                collection.updateOne(insertQuery, insertValue, (err, updatePasswordResult) => {
                                    if(err){
                                        res.status(500).json({"error": true, "message": err.message});
                                        console.log("Error(updateMemberPhotoAPI.route - 4): " + err);
                                    };
    
                                    if(updatePasswordResult){
                                        collection.findOne(checkMemberID, (err, passwordResult) => {
                                            if(err){
                                                res.status(500).json({"error": true, "message": err.message});
                                                console.log("Error(updateMemberPhotoAPI.route - 5): " + err);
                                            };
    
                                            if(passwordResult){
                                                res.status(200).json({"ok": true});
                                            };
                                        });
                                    };
                                });
                            });
                        };
                    });
                });
            };
        };
    });

});

module.exports = router;