const express = require("express");
const { client, ObjectId, s3 } = require("../commons/common");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.post("/api/discuss", upload.single("discussPhoto"), (req, res) => {

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
            const { discussID, discussDramaTitle, discussHeader, discussContent } = req.body;
            const discussPhoto = req.file;
            const photoExtension = "." + discussPhoto.mimetype.split("/").pop();
        
            client.connect(err => {
                // Error message.
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(timetableAPI.route - 1): " + err);
                };
        
                // AWS S3 upload setting.
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: generatePictureName() + photoExtension,
                    Body: fs.createReadStream(discussPhoto.path),
                    ContentType: discussPhoto.mimetype
                };
        
                // Generate random file name.
                function generatePictureName(){
                    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                    let generatedPictureName = "";
                    for (let i=0; i<8; i++){
                        generatedPictureName += characters[Math.floor(Math.random() * characters.length)];
                    };
                    return generatedPictureName;
                };
        
                // Upload drama cover photo.
                s3.upload(params, (err, uploadData) => {
                    // Upload error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(signupAPI.route - 1): " + err);
                    };

                    const memberCollection = req.db.collection("member");
                    const memberID = decoded.memberID;
                    const checkMemberID = { _id: new ObjectId(memberID) };

                    memberCollection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                        // Internal server error message.
                        if(err){
                            res.status(500).json({"error": true, "message": err.message});
                            console.log("Error(signinStatusAPI.route - 3): " + err);
                        };

                        const collection = req.db.collection("discuss");
                        const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                        const discussPhotoName = uploadData.Location.split("/").pop();
                        const discussPhotoURL = CdnURL + discussPhotoName;
                        const handledDiscussContent = discussContent.replace(/blob:https:\/\/[^\/]+\/[^"]+/, discussPhotoURL);
                        const discussMemberID = checkMemberIDResult._id.toString();
                        const discussMemberName = checkMemberIDResult.memberName;
                        const discussMemberProfilePicture = checkMemberIDResult.memberProfilePicture;
                        // Record the data insert time.
                        const date = new Date();
                        const offset = 8;
                        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                        const nd = new Date(utc + (3600000 * offset));
                        const hkTime = new Date(nd.getTime() + (3600000 * offset));
                        const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                        const discussCreatedTime = hkTimeString;

                        const insertQuery = {
                            discussID: discussID,
                            discussDramaTitle: discussDramaTitle,
                            discussHeader: discussHeader,
                            discussContent: handledDiscussContent,
                            discussMemberID: discussMemberID,
                            discussMemberName: discussMemberName,
                            discussMemberProfilePicture: discussMemberProfilePicture,
                            discussCreatedTime: discussCreatedTime
                        };
                
                        collection.insertOne(insertQuery, (err, insertResult) => {
                            if(err){
                                res.status(500).json({"error": true, "message": err.message});
                                console.log("Error(addDramaAPI.route - 3): " + err);
                            };
                
                            const insertDiscussID = insertResult.insertedId.toString();
                            const checkdiscussID = { _id: new ObjectId(insertDiscussID) };
                
                            collection.findOne(checkdiscussID, (err, checkDiscussIdResult) => {
                                // Internal server error message.
                                if(err){
                                    res.status(500).json({"error": true, "message": err.message});
                                    console.log("Error(signinStatusAPI.route - 3): " + err);
                                };
                    
                                // Return the newly added discuss ID to the frontend.
                                const data = {"discussID": checkDiscussIdResult.discussID};
                                
                                res.status(200).json({"data": data});
                            });
                        });
                    });        
                });
        
            });
        };
    });

});

module.exports = router;