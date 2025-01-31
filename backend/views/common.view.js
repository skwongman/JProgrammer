const view = {

    // Common pages.
    renderSuccessful: function(res){
        res.status(200).json({"ok": true});
    },

    renderSuccessfulData: function(result, res){
        res.status(200).json({"data": result});
    },

    renderPhotoUploadSuccessful: function(res, photoLinkResult){
        res.status(200).json({"data": photoLinkResult.memberProfilePicture});
    },

    renderDataNotFound: function(res){
        res.status(400).json({"error": true, "message": "ID not found"});
    },

    renderIncorrectFormat: function(res){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    },

    renderTypeOfPhoto: function(res){
        res.status(400).json({"error": true, "message": "The picture type should only be jpg, jpeg or png"});
    },

    renderPhotoUploadSize: function(res){
        res.status(400).json({"error": true, "message": "The picture size should only be up to 1MB"});
    },

    renderTitleFormat: function(res){
        res.status(400).json({"error": true, "message": "The title does not match with the designated format"});
    },

    renderJpTitleFormat: function(res){
        res.status(400).json({"error": true, "message": "The Japanese title does not match with the designated format"});
    },

    renderCategoryFormat: function(res){
        res.status(400).json({"error": true, "message": "The category does not match with the designated format"});
    },

    renderIntroductionFormat: function(res){
        res.status(400).json({"error": true, "message": "The introduction does not match with the designated format"});
    },

    renderTVFormat: function(res){
        res.status(400).json({"error": true, "message": "The tv does not match with the designated format"});
    },

    renderDateFormat: function(res){
        res.status(400).json({"error": true, "message": "The date does not match with the designated format"});
    },

    renderWeekFormat: function(res){
        res.status(400).json({"error": true, "message": "The week does not match with the designated format"});
    },

    renderTimeFormat: function(res){
        res.status(400).json({"error": true, "message": "The time does not match with the designated format"});
    },

    renderActorFormat: function(res){
        res.status(400).json({"error": true, "message": "The actor does not match with the designated format"});
    },

    renderRatingFormat: function(res){
        res.status(400).json({"error": true, "message": "The rating does not match with the designated format"});
    },

    renderMediaFormat: function(res){
        res.status(400).json({"error": true, "message": "The media does not match with the designated format"});
    },

    renderVideoFormat: function(res){
        res.status(400).json({"error": true, "message": "The video does not match with the designated format"});
    },

    renderTitleRegistered: function(res){
        res.status(400).json({"error": true, "message": "This drama title has been registered"});
    },

    renderForbidden: function(res){
        res.status(403).json({"error": true, "message": "forbidden"});
    },

    renderError: function(err, res, errorMessage){
        res.status(500).json({"error": true, "message": err.message});
        console.log(errorMessage);
    },

    renderOauth: function(res){
        res.status(500).json({"error": true, "message": "Using oauth"});
    },

    renderPhotoUpload: function(req){
        // Retrieve the drama photo data from the frontend side.
        const uploadPhoto = req.file;
        const photoExtension = "." + uploadPhoto.mimetype.split("/").pop();

        // Limit the photo type to jpg, jpeg and png only.
        const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
        const matchTypeOfPhoto = typeOfPhotoAllowed.includes(uploadPhoto.mimetype);

        // Limit the photo size up to 1MB only.
        const meetPhotoUploadSize = uploadPhoto.size <= 1 * 1024 * 1024 // 1MB

        return { uploadPhoto, photoExtension, matchTypeOfPhoto, meetPhotoUploadSize };
    },

    renderAWS: function(photoExtension, uploadPhoto, fs){
        // AWS S3 upload setting.
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: generatePictureName() + photoExtension,
            Body: fs.createReadStream(uploadPhoto.path),
            ContentType: uploadPhoto.mimetype
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

        return params;
    },

    renderDramaRegex: function(){
        // Use regex to verify the user input.
        const titleRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,20}$/;
        const titleJpRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FBFa-zA-Z0-9\s\u3001\u3002\uFF1F\uFF01\u2026\uFF1B\u300C\u300D\u300E\u300F\u3010\u3011\uFF08\uFF09\uFF1C\uFF1E\uFFE5\uFF1A\u2019\u201D\u3014\u3015\u00B7\uFF01\u0040\uFFE5\u0025\u2026\u0026\uFF0A\uFF09\u2014\u3016\u3017\u007B\u007D\u003B\u0027\u0022\u005B\u005D\u005C\u002C\u002E\u003C\u003E\u002F\u003F\u0040]{1,20}$/;
        const categoryRegex = /^[\u4e00-\u9fa5\/]{1,10}$/;
        const introductionRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;
        const TVRegex = /^[\u4e00-\u9fa5a-zA-Z]{1,10}$/;
        const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        const weekRegex = /^[\u4e00-\u9fa5]{3}$/;
        const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
        const actorRegex = /^([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10})(,\s([\u4e00-\u9fa5]{1,10})\s\/\s([\u4e00-\u9fa5]{1,10}))*$/;
        const ratingRegex = /^(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1}))(,\s(None|[0-9]{1}(\.[0-9]{1})?|[0-9]{2}(\.[0-9]{1})?|[0-9]{3}(\.[0-9]{1})?|[0-9]{4}(\.[0-9]{1})))*$/;
        const mediaRegex = /^https:\/\/(www\.)?[\w\/\.\-]+$/;
        const videoRegex = /^(None|(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32})(,\s(magnet:\?xt=urn:[a-z0-9]+:[a-z0-9A-Z]{32}))*)$/;
    
        return {
            titleRegex, titleJpRegex, categoryRegex, introductionRegex, TVRegex, dateRegex,
            weekRegex, timeRegex, actorRegex, ratingRegex, mediaRegex, videoRegex
        };
    },


    // Drama page.
    renderDramaQueryStringData: function(result, res, getAverageColor){
        const photoURL = result[0].dramaCoverPhoto;
    
        getAverageColor(photoURL).then(color => {
            const dominantColor = color.rgba.replace(",1)", ",0.84)");
            const isDark = color.isDark;

            res.status(200).json({"data": {"drama": result[0], "dominantColor": dominantColor, "isDark": isDark}});
        });
    },

    renderVideoAuth: function(res){
        res.status(403).json({"error": true, "message": "restricted to test account at this stage only"});
    },


    // Index page.
    renderVariables: function(req){
        const dataPerPage = 18;
        const keyword = req.query.keyword || null;
        const page = parseInt(req.query.page) || 0;
        const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-6, Page 1: 7-12, etc.

        return { dataPerPage, keyword, page, dataOrderPerPage };
    },

    renderDramaData: function(result, res, dataOrderPerPage, dataPerPage, page){
        // Determine nextPage value.
        const data = result[0].data;
        const count = result[0].metadata[0].count;
        const nextPage = (count > dataOrderPerPage + dataPerPage) ? page + 1 : null;
        const totalPages = Math.ceil(count / dataPerPage); // Determine the total pages.

        res.status(200).json({"totalPages": totalPages, "nextPage": nextPage, "data": data});
    },


    // Signin page.
    renderSigninUserInput: function(req){
        const signupName = req.body.name;
        const signupEmail = req.body.email;
        const signupPassword = req.body.password;
        const updatePassword = req.body.updatePassword;

        const nameRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\a-z\d]{1,20}/;
        const emailRegex = /^([\w-]+)@([a-z\d-]+)\.([a-z]{2,8})([\.a-z]{2,8})?$/;
        const passwordRegex = /^[\w`~!@#$%^&*()=+-]{8,20}$/;

        return { signupName, signupEmail, signupPassword, updatePassword, nameRegex, emailRegex, passwordRegex };
    },

    renderJWTCookie: function(res, result, jwt){
        // Create JWT with member id.
        const secretKey = process.env.JWT_SECRET_KEY;
        const memberID = result._id.toString();
        const token = jwt.sign({memberID}, secretKey);

        // Use cookie to wrap the JWT.
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const expiryDate = new Date(Date.now() + thirtyDaysInMs);
        res.cookie("token", token, {expires: expiryDate, httpOnly: true, secure: true, sameSite: "strict" });
    },

    renderOauthJWTCookie: function(res, jwt, userInfo){
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(userInfo.data, secretKey);
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const expiryDate = new Date(Date.now() + thirtyDaysInMs);
        res.cookie("token", token, {expires: expiryDate, httpOnly: false, secure: false });
        res.redirect('/');
    },

    renderMemberData: function(res, memberData){
        res.status(200).json({"data": memberData});
    },

    renderEmailNotFound: function(res){
        res.status(400).json({"error": true, "message": "The email is not found"});
    },

    renderPasswordIncorrect: function(res){
        res.status(400).json({"error": true, "message": "The password is not correct"});
    },

    renderEmailRegistered: function(res){
        res.status(400).json({"error": true, "message": "This email has been registered"});
    },

    renderSigninOauthStatusError: function(res){
        res.clearCookie("token");
        res.status(400).json({"error": true, "message": "Error fetching user info"});
    },


    // Add drama page.
    renderConvertAddDramaData: function(dramaIdResult, addDramaCategory, addDramaActor, addDramaRating, addDramaVideo, checkMemberIDResult){
        // Get latest drama id from the last drama id plus one.
        const latestDramaID = dramaIdResult[0].dramaID + 1;

        // Convert the drama category to array format.
        const clearAddDramaCategory = [addDramaCategory];

        // Split the user input and convert to the array format.
        const clearAddDramaActorCast = addDramaActor.split(", ");
        const clearAddDramaActor = [];
        const clearAddDramaCast = [];

        for(let i of clearAddDramaActorCast){
            clearAddDramaActor.push(i.split(" / ")[0]);
            clearAddDramaCast.push(i.split(" / ")[1] + " / " + i.split(" / ")[0]);
        };

        // Split the user input and convert to the array format.
        if(addDramaRating == "None"){ // Handle no input drama rating from user.
            addDramaRating = "None";
        };

        const clearAddDramaRating = addDramaRating.split(", ");
        const clearAddDramaRatingList = [];
        
        for(let i of clearAddDramaRating){
            clearAddDramaRatingList.push(i);
        };

        // Split the user input and convert to the array format.
        const clearAddDramaVideo = addDramaVideo.split(", ");
        const clearAddDramaVideoList = [];

        for(let i of clearAddDramaVideo){
            clearAddDramaVideoList.push(i);
        };

        // Get memberID from JWT for record purpose.
        const addDramaMemberID = checkMemberIDResult._id.toString();

        return {
            latestDramaID, clearAddDramaCategory, clearAddDramaActor, clearAddDramaCast,
            clearAddDramaRatingList, clearAddDramaVideoList, addDramaMemberID
        };
    },


    // Discuss page.
    renderDiscussTitleFormat: function(res){
        res.status(400).json({"error": true, "message": "The title does not match with the designated format"});
    },
    renderDiscussContentFormat: function(res){
        res.status(400).json({"error": true, "message": "The content does not match with the designated format"});
    },
    renderDiscussData: function(req){
        const { discussPostID, discussDramaTitle, discussHeader, discussContent } = req.body;
        const handleDiscussPostID = parseInt(discussPostID);
        const uploadPhoto = req.file;
        const photoExtension = "." + uploadPhoto.mimetype.split("/").pop();

        const titleRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,20}$/;
        const postRegex = /<\s*([a-zA-Z]+\d*)\s*[^>]*>(.*?[\p{L}\p{N}\p{P}\u4E00-\u9FFF]*)<\/\s*\1\s*>/su;

        return {
            discussDramaTitle, discussHeader, discussContent, handleDiscussPostID,
            uploadPhoto, photoExtension, titleRegex, postRegex
        };
    },
    renderDiscussVariables: function(res, result, skip, limit, page){
        const count = result[0].count;
        const data = result[0];
        const nextPage = (count > skip + limit) ? page + 1 : null;
        const totalPages = (count == 0) ? 1 : Math.ceil(count / limit);

        res.status(200).json({totalPages, nextPage, data});
    },
    renderDiscussReplyUserInput: function(req){
        const { replyPostID, replyDramaTitle, replyContent } = req.body;
        const handleReplyPostID = parseInt(replyPostID);
        const uploadPhoto = req.file;
        
        const photoExtension = "." + uploadPhoto.mimetype.split("/").pop();
        const postRegex = /<\s*([a-zA-Z]+\d*)\s*[^>]*>(.*?[\p{L}\p{N}\p{P}\u4E00-\u9FFF]*)<\/\s*\1\s*>/su;

        return { replyDramaTitle, replyContent, handleReplyPostID, uploadPhoto, photoExtension, postRegex };
    },


    // Edit drama cover photo.
    renderEditPhoto: function(res, getAverageColor, addDramaCoverPhotoURL, updateIndicator, editResult){
        getAverageColor(addDramaCoverPhotoURL).then(color => {
            const dominantColor = color.rgba.replace(",1)", ",0.84)");
            const isDark = color.isDark;

            if(updateIndicator == "edit7"){
                res.status(200).json({"data": editResult.dramaCoverPhoto, "dominantColor": dominantColor, "isDark": isDark});
            };
        });
    },
    renderEditInformationSuccessful: function(res, result){
        res.status(200).json({"data": {"dramaActor": result[0].dramaActor, "dramaCast": result[0].dramaCast}});
    }

};

module.exports = {

    // Common pages.
    renderSuccessfulData: view.renderSuccessfulData,
    renderSuccessful: view.renderSuccessful,
    renderPhotoUploadSuccessful: view.renderPhotoUploadSuccessful,
    renderIncorrectFormat: view.renderIncorrectFormat,
    renderDataNotFound: view.renderDataNotFound,
    renderTypeOfPhoto: view.renderTypeOfPhoto,
    renderPhotoUploadSize: view.renderPhotoUploadSize,
    renderTitleFormat: view.renderTitleFormat,
    renderJpTitleFormat: view.renderJpTitleFormat,
    renderCategoryFormat: view.renderCategoryFormat,
    renderIntroductionFormat: view.renderIntroductionFormat,
    renderTVFormat: view.renderTVFormat,
    renderDateFormat: view.renderDateFormat,
    renderWeekFormat: view.renderWeekFormat,
    renderTimeFormat: view.renderTimeFormat,
    renderActorFormat: view.renderActorFormat,
    renderRatingFormat: view.renderRatingFormat,
    renderMediaFormat: view.renderMediaFormat,
    renderVideoFormat: view.renderVideoFormat,
    renderForbidden: view.renderForbidden,
    renderError: view.renderError,
    renderOauth: view.renderOauth,
    renderPhotoUpload: view.renderPhotoUpload,
    renderAWS: view.renderAWS,
    renderDramaRegex: view.renderDramaRegex,
    renderConvertAddDramaData: view.renderConvertAddDramaData,

    // Drama page.
    renderDramaQueryStringData: view.renderDramaQueryStringData,
    renderVideoAuth: view.renderVideoAuth,

    // Index page.
    renderVariables: view.renderVariables,
    renderDramaData: view.renderDramaData,

    // Signin page.
    renderSigninUserInput: view.renderSigninUserInput,
    renderJWTCookie: view.renderJWTCookie,
    renderOauthJWTCookie: view.renderOauthJWTCookie,
    renderMemberData: view.renderMemberData,
    renderEmailNotFound: view.renderEmailNotFound,
    renderPasswordIncorrect: view.renderPasswordIncorrect,
    renderEmailRegistered: view.renderEmailRegistered,
    renderSigninOauthStatusError: view.renderSigninOauthStatusError,

    // Add drama page.
    renderTitleRegistered: view.renderTitleRegistered,

    // Discuss Page.
    renderDiscussTitleFormat: view.renderDiscussTitleFormat,
    renderDiscussContentFormat: view.renderDiscussContentFormat,
    renderDiscussData: view.renderDiscussData,
    renderDiscussVariables: view.renderDiscussVariables,
    renderDiscussReplyUserInput: view.renderDiscussReplyUserInput,

    // Edit drama cover photo
    renderEditPhoto: view.renderEditPhoto,
    renderEditInformationSuccessful: view.renderEditInformationSuccessful

};