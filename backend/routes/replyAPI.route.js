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

router.post("/api/reply", upload.single("replyPhoto"), (req, res) => {

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
            const { replyPostID, replyDramaTitle, replyContent } = req.body;
            const handleReplyPostID = parseInt(replyPostID);
            const replyPhoto = req.file;
            const photoExtension = "." + replyPhoto.mimetype.split("/").pop();
            const postRegex = /<\s*([a-zA-Z]+\d*)\s*[^>]*>(.*?[\p{L}\p{N}\p{P}\u4E00-\u9FFF]*)<\/\s*\1\s*>/su;

            if(!replyContent.match(postRegex)){
                res.status(400).json({"error": true, "message": "The input does not match with the designated format"});
            }
            else{
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
                        Body: fs.createReadStream(replyPhoto.path),
                        ContentType: replyPhoto.mimetype
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
    
                            const collection = req.db.collection("reply");
                            const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                            const replyPhotoName = uploadData.Location.split("/").pop();
                            const replyPhotoURL = CdnURL + replyPhotoName;
                            const handledReplyContent = replyContent.replace(/blob:https:\/\/[^\/]+\/[^"]+/, replyPhotoURL);
                            const replyMemberID = checkMemberIDResult._id.toString();
                            const replyMemberName = checkMemberIDResult.memberName;
                            const replyMemberProfilePicture = checkMemberIDResult.memberProfilePicture;
                            const defaultLikeCount = 0;
                            // Record the data insert time.
                            const date = new Date();
                            const offset = 8;
                            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                            const nd = new Date(utc + (3600000 * offset));
                            const hkTime = new Date(nd.getTime() + (3600000 * offset));
                            const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                            const replyCreatedTime = hkTimeString;
    
                            function generateReplyID(){
                                const date = new Date();
                                const year = date.getUTCFullYear().toString();
                                const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                                const day = date.getUTCDate().toString().padStart(2, '0');
                                const hours = date.getUTCHours().toString().padStart(2, '0');
                                const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                                const seconds = date.getUTCSeconds().toString().padStart(2, '0');
                                const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
                                const hkTime = year + month + day + hours + minutes + seconds + milliseconds;
                                const replyID = parseInt(hkTime);
                                return replyID;
                            };
    
                            const insertQuery = {
                                replyID: generateReplyID(),
                                replyPostID: handleReplyPostID,
                                replyDramaTitle: replyDramaTitle,
                                replyContent: handledReplyContent,
                                replyMemberID: replyMemberID,
                                replyMemberName: replyMemberName,
                                replyMemberProfilePicture: replyMemberProfilePicture,
                                replyLike: defaultLikeCount,
                                replyCreatedTime: replyCreatedTime
                            };
                    
                            collection.insertOne(insertQuery, (err, insertResult) => {
                                if(err){
                                    res.status(500).json({"error": true, "message": err.message});
                                    console.log("Error(addDramaAPI.route - 3): " + err);
                                };
                    
                                const insertReplyID = insertResult.insertedId.toString();
                                const checkReplyID = { _id: new ObjectId(insertReplyID) };
                    
                                collection.findOne(checkReplyID, (err, checkReplyIdResult) => {
                                    // Internal server error message.
                                    if(err){
                                        res.status(500).json({"error": true, "message": err.message});
                                        console.log("Error(signinStatusAPI.route - 3): " + err);
                                    };
                                    
                                    res.status(200).json({"ok": true});
                                });
                            });
                        });        
                    });
            
                });
            };

        };
    });

});

module.exports = router;