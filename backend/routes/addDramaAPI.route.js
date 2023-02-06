const express = require("express");
const { client, ObjectId } = require("../commons/common");
const router = express.Router();

// Middleware function to add the database connection to the request object.
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

router.post("/api/add", (req, res) => {

    const {
        addDramaTitle,
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

    // Use regex to verify the user input.
    const titleRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,20}$/;
    const categoryRegex = /^[\u4e00-\u9fa5]{1,10}$/;
    const introductionRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;
    const TVRegex = /^[\u4e00-\u9fa5]{1,10}$/;
    const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    const weekRegex = /^[\u4e00-\u9fa5]{3}$/;
    const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
    const actorRegex = /^([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10})(,\s([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10}))*$/;
    const ratingRegex = /^(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1}))(,\s(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1})))*$/;
    const mediaRegex = /^https:\/\/(www\.)?[\w\/\.]+$/;

    // If the regex is invalid.
    if(!addDramaTitle.match(titleRegex)){
        res.status(400).json({"error": true, "message": "The title does not match with the designated format"});
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
                        
                        // Assign name for each record.
                        const insertQuery = {
                            dramaID: latestDramaID,
                            dramaTitle: addDramaTitle,
                            dramaIntroduction: addDramaIntroduction,
                            dramaDateOfBoardcast: addDramaDateOfBroadcast,
                            dramaCategory: clearAddDramaCategory,
                            dramaActor: clearAddDramaActor,
                            dramaCast: clearAddDramaCast,
                            dramaCoverPhoto: 'https://drive.google.com/uc?id=1C698VYieTl4beXx4hnR4MxbsooWWtfG7',
                            dramaRating: clearAddDramaRatingList,
                            dramaTV: addDramaTV,
                            dramaWeek: addDramaWeek,
                            dramaTimeOfBoardcast: addDramaTimeOfBoardcast,
                            dramaViewCount: 0,
                            dramaMedia: addDramaMedia,
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
                };
            });
        });
    };

});

module.exports = router;