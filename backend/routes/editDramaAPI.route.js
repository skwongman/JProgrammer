const express = require("express");
const { client, ObjectId, s3 } = require("../commons/common");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({dest: "/backend/uploads"});
const { getAverageColor } = require("fast-average-color-node");
const router = express.Router();

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.put("/api/edit/:id", upload.single("editDramaCoverPhoto"), (req, res) => {

    //
    let editDramaID = req.params.id;
    editDramaID = parseInt(editDramaID);

    const editDramaContent = req.body.editDramaContent;
    const updateIndicator = req.body.updateIndicator;
    const addDramaPhoto = req.file;

    if(addDramaPhoto != undefined){
        const photoExtension = "." + addDramaPhoto.mimetype.split("/").pop();
    
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
            const CdnURL = "https://d11c6b10livv50.cloudfront.net/";
            const addDramaCoverPhotoName = data.Location.split("/").pop();
            const addDramaCoverPhotoURL = CdnURL + addDramaCoverPhotoName;
            
            let insertValue = null;
            if(updateIndicator == "edit7"){
                insertValue = { $set: { dramaCoverPhoto: addDramaCoverPhotoURL } };
            };
        
            client.connect(err => {
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(timetableAPI.route - 1): " + err);
                };
        
                const collection = req.db.collection("drama");
                const insertQuery = { dramaID: editDramaID };
                // const insertValue = { $set: { dramaIntroduction: editDramaIntroduction } };
        
                collection.updateOne(insertQuery, insertValue, (err, result) => {
                    if(err){
                        res.status(500).json({"error": true, "message": err.message});
                        console.log("Error(timetableAPI.route - 2): " + err);
                    };
        
                    collection.findOne({dramaID: editDramaID}, (err, editResult) => {
                        // res.status(200).json({"data": editResult.dramaIntroduction});

                        const photoURL = addDramaCoverPhotoURL;

                        getAverageColor(photoURL).then(color => {
                            const dominantColor = color.rgba.replace(",1)", ",0.84)");
                            const isDark = color.isDark;
        
                            if(updateIndicator == "edit7"){
                                res.status(200).json({"data": editResult.dramaCoverPhoto, "dominantColor": dominantColor, "isDark": isDark});
                            }
                        });
        
                    });
                
                });
                
            });

        });
    }
    else{

        let insertValue = null;
        if(updateIndicator == "edit1"){
            insertValue = { $set: { dramaCategory: [editDramaContent] } };
        }
        else if(updateIndicator == "edit2"){
            insertValue = { $set: { dramaIntroduction: editDramaContent } };
        }
        else if(updateIndicator == "edit3"){
            insertValue = { $set: { dramaTV: editDramaContent } };
        }
        else if(updateIndicator == "edit4"){
            insertValue = { $set: { dramaDateOfBoardcast: editDramaContent } };
        }
        else if(updateIndicator == "edit5"){
            insertValue = { $set: { dramaWeek: editDramaContent } };
        }
        else if(updateIndicator == "edit6"){
            insertValue = { $set: { dramaTimeOfBoardcast: editDramaContent } };
        }
        else if(updateIndicator == "edit7"){

            const clearEditDramaContent = editDramaContent.split(", ");
            const dramaVideo = [];
            for(let i of clearEditDramaContent){
                dramaVideo.push(i);
            };

            insertValue = { $set: { dramaVideo: dramaVideo } };
        }
        else if(updateIndicator == "edit8"){

            const clearAddDramaActorCast = editDramaContent.split(", ");
            const clearAddDramaActor = [];
            const clearAddDramaCast = [];
            for(let i of clearAddDramaActorCast){
                clearAddDramaActor.push(i.split(" / ")[0]);
                clearAddDramaCast.push(i.split(" / ")[1] + " / " + i.split(" / ")[0]);
            };

            insertValue = {
                $set: {
                    dramaActor: clearAddDramaActor,
                    dramaCast: clearAddDramaCast
                }
            };
        }
        else if(updateIndicator == "edit9"){

            const clearEditDramaContent = editDramaContent.split(", ");
            const dramaRating = [];
            for(let i of clearEditDramaContent){
                dramaRating.push(i);
            };

            insertValue = { $set: { dramaRating: dramaRating } };
        }



        client.connect(err => {
            if(err){
                res.status(500).json({"error": true, "message": err.message});
                console.log("Error(timetableAPI.route - 1): " + err);
            };

            const collection = req.db.collection("drama");
            const insertQuery = { dramaID: editDramaID };
            // const insertValue = { $set: { dramaIntroduction: editDramaIntroduction } };

            collection.updateOne(insertQuery, insertValue, (err, result) => {
                if(err){
                    res.status(500).json({"error": true, "message": err.message});
                    console.log("Error(timetableAPI.route - 2): " + err);
                };

                collection.findOne({dramaID: editDramaID}, (err, editResult) => {

                    if(updateIndicator == "edit1"){
                        res.status(200).json({"data": editResult.dramaCategory});
                    }
                    else if(updateIndicator == "edit2"){
                        res.status(200).json({"data": editResult.dramaIntroduction});
                    }
                    else if(updateIndicator == "edit3"){
                        res.status(200).json({"data": editResult.dramaTV});
                    }
                    else if(updateIndicator == "edit4"){
                        res.status(200).json({"data": editResult.dramaDateOfBoardcast});
                    }
                    else if(updateIndicator == "edit5"){
                        res.status(200).json({"data": editResult.dramaWeek});
                    }
                    else if(updateIndicator == "edit6"){
                        res.status(200).json({"data": editResult.dramaTimeOfBoardcast});
                    }
                    else if(updateIndicator == "edit7"){
                        res.status(200).json({"data": editResult.dramaVideo});
                    }
                    else if(updateIndicator == "edit9"){
                        res.status(200).json({"data": editResult.dramaRating});
                    }
                });

                if(updateIndicator == "edit8"){

                    const matchDramaID = { $match: { dramaID: editDramaID } };
                    const unwind = { $unwind: "$dramaActor" };
                    const aggreActor = {
                        $lookup: {
                            from: "actorMix",
                            localField: "dramaActor",
                            foreignField: "actorNameChi",
                            as: "dramaActor"
                        }
                    };
                    const limitNoOfCast = { $limit: 9 };
                    const group = {
                        $group: {
                            _id: "$_id",
                            dramaID: { $first: "$dramaID" },
                            dramaActor: { $push: "$dramaActor" },
                            dramaCast: { $first: "$dramaCast" }
                        }
                    };
                    const sortlisted = {
                        $project: {
                            _id: 0,
                            "dramaActor._id": 0,
                            "dramaActor._id": 0,
                            "dramaActor.actorID": 0,
                            "dramaActor.actorNameJp": 0,
                            "dramaActor.actorCreatedTime": 0
                        }
                    };
    
                    const aggregatePipeline = [matchDramaID, unwind, aggreActor, limitNoOfCast, group, sortlisted];
    
                    // Fetching data
                    collection
                    .aggregate(aggregatePipeline)
                    .limit(1)
                    .toArray((err, result) => {
                        if(err){
                            res.status(500).json({"error": true, "message": err.message});
                            console.log("Error(dramaQueryStringAPI.route - 2): " + err);
                        };
    
                        // console.log(result[0].dramaActor)
                        // console.log(result[0].dramaCast)
    
                        res.status(200).json({"data": {"dramaActor": result[0].dramaActor, "dramaCast": result[0].dramaCast}});
                        
                    });

                }


            
            });






            
        });
    };





    



});

module.exports = router;