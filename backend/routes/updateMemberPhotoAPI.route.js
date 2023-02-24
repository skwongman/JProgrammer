const express = require("express");
const { client, ObjectId, s3 } = require("../commons/common");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.put("/api/member/photo", upload.single("updateProfilePhoto"), (req, res) => {

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
                        // Retrieve the drama photo data from the frontend side.
                        const updateProfilePhoto = req.file;
                        const photoExtension = "." + updateProfilePhoto.mimetype.split("/").pop();

                        // Limit the photo type to jpg, jpeg and png only.
                        const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
                        const matchTypeOfPhoto = typeOfPhotoAllowed.includes(updateProfilePhoto.mimetype);

                        if(!matchTypeOfPhoto){
                            res.status(400).json({"error": true, "message": "The picture type should only be jpg, jpeg or png."});
                        };

                        // Limit the photo size up to 1MB only.
                        const meetPhotoUploadSize = updateProfilePhoto.size <= 1 * 1024 * 1024 // 1MB

                        if(!meetPhotoUploadSize){
                            res.status(400).json({"error": true, "message": "The picture size should only be up to 1MB."});
                        };

                        // AWS S3 upload setting.
                        const params = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: generatePictureName() + photoExtension,
                            Body: fs.createReadStream(updateProfilePhoto.path),
                            ContentType: updateProfilePhoto.mimetype
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
                    
                        // Upload profile photo.
                        s3.upload(params, (err, data) => {
                            // Upload error message.
                            if(err){
                                res.status(500).json({"error": true, "message": err.message});
                                console.log("Error(updateMemberPhotoAPI.route - 3): " + err);
                            };
                    
                            const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
                            const updatePhotoName = data.Location.split("/").pop();
                            const updatePhotoURL = CdnURL + updatePhotoName;

                            // Assign name for each item.
                            const insertQuery = checkMemberID;
                            const insertValue = { $set: { memberProfilePicture: updatePhotoURL } };

                            collection.updateOne(insertQuery, insertValue, (err, updatePhotoResult) => {
                                if(err){
                                    res.status(500).json({"error": true, "message": err.message});
                                    console.log("Error(updateMemberPhotoAPI.route - 4): " + err);
                                };

                                if(updatePhotoResult){
                                    collection.findOne(checkMemberID, (err, photoLinkResult) => {
                                        if(err){
                                            res.status(500).json({"error": true, "message": err.message});
                                            console.log("Error(updateMemberPhotoAPI.route - 5): " + err);
                                        };

                                        if(photoLinkResult){
                                            res.status(200).json({"data": photoLinkResult.memberProfilePicture});
                                        };
                                    });
                                };
                            });
                        });
                    };
                });
            });            
        };
    });

});

module.exports = router;