const express = require("express");
const { client, ObjectId, s3 } = require("../commons/common");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.post("/api/add", upload.single("addDramaCoverphoto"), (req, res) => {

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
                    console.log("Error(signinStatusAPI.route - 2): " + err);
                };
        
                // Fetching user data from database.
                const collection = req.db.collection("member");
                const memberID = decoded.memberID;
                const checkMemberID = { _id: new ObjectId(memberID) };
        
                collection.findOne(checkMemberID, (err, checkMemberIDResult) => {
                    // Internal server error message.
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(signinStatusAPI.route - 3): " + err);
                    };
        
                    const {
                        addDramaTitle,
                        addDramaTitleJp,
                        addDramaCategory,
                        addDramaIntroduction,
                        addDramaTV,
                        addDramaDateOfBroadcast,
                        addDramaWeek,
                        addDramaTimeOfBoardcast,
                        addDramaActor,
                        addDramaMedia
                    } = req.body;
                
                    let addDramaRating = req.body.addDramaRating || "None";

                    let addDramaVideo = req.body.addDramaVideo || "None";
                
                    // Use regex to verify the user input.
                    const titleRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,20}$/;
                    const titleJpRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FBFa-zA-Z0-9\s\u3001\u3002\uFF1F\uFF01\u2026\uFF1B\u300C\u300D\u300E\u300F\u3010\u3011\uFF08\uFF09\uFF1C\uFF1E\uFFE5\uFF1A\u2019\u201D\u3014\u3015\u00B7\uFF01\u0040\uFFE5\u0025\u2026\u0026\uFF0A\uFF09\u2014\u3016\u3017\u007B\u007D\u003B\u0027\u0022\u005B\u005D\u005C\u002C\u002E\u003C\u003E\u002F\u003F\u0040]{1,20}$/;
                    const categoryRegex = /^[\u4e00-\u9fa5]{1,10}$/;
                    const introductionRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;
                    const TVRegex = /^[\u4e00-\u9fa5]{1,10}$/;
                    const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                    const weekRegex = /^[\u4e00-\u9fa5]{3}$/;
                    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
                    const actorRegex = /^([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10})(,\s([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10}))*$/;
                    const ratingRegex = /^(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1}))(,\s(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1})))*$/;
                    const mediaRegex = /^https:\/\/(www\.)?[\w\/\.\-]+$/;
                    const videoRegex = /^(None|(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32})(,\s(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32}))*)$/;

                    // If the regex is invalid.
                    if(!addDramaTitle.match(titleRegex)){
                        res.status(400).json({"error": true, "message": "The title does not match with the designated format"});
                    }
                    else if(!addDramaTitleJp.match(titleJpRegex)){
                        res.status(400).json({"error": true, "message": "The Japanese title does not match with the designated format"});
                    }
                    else if(!addDramaCategory.match(categoryRegex)){
                        res.status(400).json({"error": true, "message": "The category does not match with the designated format"});
                    }
                    else if(!addDramaIntroduction.match(introductionRegex)){
                        res.status(400).json({"error": true, "message": "The introduction does not match with the designated format"});
                    }
                    else if(!addDramaTV.match(TVRegex)){
                        res.status(400).json({"error": true, "message": "The tv does not match with the designated format"});
                    }
                    else if(!addDramaDateOfBroadcast.match(dateRegex)){
                        res.status(400).json({"error": true, "message": "The date does not match with the designated format"});
                    }
                    else if(!addDramaWeek.match(weekRegex)){
                        res.status(400).json({"error": true, "message": "The week does not match with the designated format"});
                    }
                    else if(!addDramaTimeOfBoardcast.match(timeRegex)){
                        res.status(400).json({"error": true, "message": "The time does not match with the designated format"});
                    }
                    else if(!addDramaActor.match(actorRegex)){
                        res.status(400).json({"error": true, "message": "The actor does not match with the designated format"});
                    }
                    else if(!addDramaRating.match(ratingRegex)){
                        res.status(400).json({"error": true, "message": "The rating does not match with the designated format"});
                    }
                    else if(!addDramaMedia.match(mediaRegex)){
                        res.status(400).json({"error": true, "message": "The media does not match with the designated format"});
                    }
                    else if(!addDramaVideo.match(videoRegex)){
                        res.status(400).json({"error": true, "message": "The video does not match with the designated format"});
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
                            const collection = req.db.collection("drama");
                            const checkaddDramaTitle = { dramaTitle: addDramaTitle };
                    
                            collection.findOne(checkaddDramaTitle, (err, result) => {
                                // Internal server error message.
                                if(err){
                                    res.status(500).json({"error": true, "message": err.message});
                                    console.log("Error(addDramaAPI.route - 1): " + err);
                                };
                    
                                // If drama title is found.
                                if(result != null){
                                    res.status(400).json({"error": true, "message": "This drama title has been registered"});
                                }
                                // If drama title is not found.
                                else{
                                    // Get the drama ID from the lastest drama ID before adding drama record.
                                    const sortlisted = { projection: {_id: 0, dramaID: 1} };
                                    const findLatestDramaID = { dramaID: -1 };
                            
                                    collection.find({}, sortlisted).limit(1).sort(findLatestDramaID).toArray((err, dramaIdResult) => {
                                        if(err){
                                            res.status(500).json({"error": true, "message": err.message});
                                            console.log("Error(addDramaAPI.route - 2): " + err);
                                        };
                
                                        // Retrieve the drama photo data from the frontend side.
                                        const addDramaPhoto = req.file;
                                        const photoExtension = "." + addDramaPhoto.mimetype.split("/").pop();

                                        // Limit the photo type to jpg, jpeg and png only.
                                        const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
                                        const matchTypeOfPhoto = typeOfPhotoAllowed.includes(addDramaPhoto.mimetype);
                                        if(!matchTypeOfPhoto){
                                            res.status(400).json({"error": true, "message": "The picture type should only be jpg, jpeg or png."});
                                        };

                                        // Limit the photo size up to 1MB only.
                                        const meetPhotoUploadSize = addDramaPhoto.size <= 1 * 1024 * 1024 // 1MB
                                        if(!meetPhotoUploadSize){
                                            res.status(400).json({"error": true, "message": "The picture size should only be up to 1MB."});
                                        };

                                        // AWS S3 upload setting.
                                        const params = {
                                            Bucket: process.env.AWS_BUCKET,
                                            Key: generatePictureName() + photoExtension,
                                            Body: fs.createReadStream(addDramaPhoto.path),
                                            ContentType: addDramaPhoto.mimetype
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
                                        s3.upload(params, (err, data) => {
                                            // Upload error message.
                                            if(err){
                                                res.status(500).json({"error": true, "message": err.message});
                                                console.log("Error(signupAPI.route - 1): " + err);
                                            };
                                    
                                            const addDramaCoverPhotoName = data.Location.split("/").pop();
                                            const addDramaCoverPhotoURL = "https://d11c6b10livv50.cloudfront.net/" + addDramaCoverPhotoName;
                
                                            // Data clearance before adding record.
                                            const latestDramaID = dramaIdResult[0].dramaID + 1;
                                            const clearAddDramaCategory = [addDramaCategory];
                                            const clearAddDramaActorCast = addDramaActor.split(", ");
                                            const clearAddDramaActor = [];
                                            const clearAddDramaCast = [];
                                            for(let i of clearAddDramaActorCast){
                                                clearAddDramaActor.push(i.split(" / ")[0]);
                                                clearAddDramaCast.push(i.split(" / ")[1] + " / " + i.split(" / ")[0]);
                                            };
                                            const date = new Date();
                                            const offset = 8;
                                            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                                            const nd = new Date(utc + (3600000 * offset));
                                            const hkTime = new Date(nd.getTime() + (3600000 * offset));
                                            const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                                            const dramaCreatedTime = hkTimeString;
                                            if(addDramaRating == "None"){
                                                addDramaRating = "None";
                                            };
                                            const clearAddDramaRating = addDramaRating.split(", ");
                                            const clearAddDramaRatingList = [];
                                            for(let i of clearAddDramaRating){
                                                clearAddDramaRatingList.push(i);
                                            };
                                            const clearAddDramaVideo = addDramaVideo.split(", ");
                                            const clearAddDramaVideoList = [];
                                            for(let i of clearAddDramaVideo){
                                                clearAddDramaVideoList.push(i);
                                            };

                                            // Get memberID from JWT.
                                            const addDramaMemberID = checkMemberIDResult._id.toString();

                                            // Assign name for each record.
                                            const insertQuery = {
                                                dramaID: latestDramaID,
                                                dramaTitle: addDramaTitle,
                                                dramaTitleJp: addDramaTitleJp,
                                                dramaIntroduction: addDramaIntroduction,
                                                dramaDateOfBoardcast: addDramaDateOfBroadcast,
                                                dramaCategory: clearAddDramaCategory,
                                                dramaActor: clearAddDramaActor,
                                                dramaCast: clearAddDramaCast,
                                                dramaCoverPhoto: addDramaCoverPhotoURL,
                                                dramaRating: clearAddDramaRatingList,
                                                dramaTV: addDramaTV,
                                                dramaWeek: addDramaWeek,
                                                dramaTimeOfBoardcast: addDramaTimeOfBoardcast,
                                                dramaViewCount: 0,
                                                dramaMedia: addDramaMedia,
                                                dramaVideo: clearAddDramaVideoList,
                                                dramaMemberID: addDramaMemberID,
                                                dramaCreatedTime: dramaCreatedTime
                                            };
                        
                                            // Insert drama data into the database.
                                            collection.insertOne(insertQuery, (err, insertResult) => {
                                                if(err){
                                                    res.status(500).json({"error": true, "message": err.message});
                                                    console.log("Error(addDramaAPI.route - 3): " + err);
                                                };
                
                                                const insertDramaID = insertResult.insertedId.toString();
                                                const checkDramaID = { _id: new ObjectId(insertDramaID) };
                
                                                // Find the newly added drama ID.
                                                collection.findOne(checkDramaID, (err, checkaddDramaIdResult) => {
                                                    // Internal server error message.
                                                    if(err){
                                                        res.status(500).json({"error": true, "message": err.message});
                                                        console.log("Error(signinStatusAPI.route - 3): " + err);
                                                    };
                                        
                                                    // Return the newly added drama ID to the frontend.
                                                    const data = {
                                                        "addDramaID": checkaddDramaIdResult.dramaID
                                                    };
                                                    
                                                    res.status(200).json({"data": data});
                                                });
                                            });
                                        });
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