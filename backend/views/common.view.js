const view = {

    // Common pages.
    renderSuccessfulData: function(result, res){
        res.status(200).json({"data": result});
    },

    renderSuccessful: function(res){
        res.status(200).json({"ok": true});
    },

    renderPhotoUploadSuccessful: function(res, photoLinkResult){
        res.status(200).json({"data": photoLinkResult.memberProfilePicture});
    },

    renderIncorrectFormat: function(res){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    },

    renderDataNotFound: function(res){
        res.status(400).json({"error": true, "message": "ID not found"});
    },

    renderTypeOfPhoto: function(res){
        res.status(400).json({"error": true, "message": "The picture type should only be jpg, jpeg or png"});
    },

    renderPhotoUploadSize: function(res){
        res.status(400).json({"error": true, "message": "The picture size should only be up to 1MB"});
    },

    renderForbidden: function(res){
        res.status(403).json({"error": true, "message": "forbidden"});
    },

    renderError: function(err, res, errorMessage){
        res.status(500).json({"error": true, "message": err.message});
        console.log(errorMessage);
    },

    renderPhotoUpload: function(req){
        // Retrieve the drama photo data from the frontend side.
        const updateProfilePhoto = req.file;
        const photoExtension = "." + updateProfilePhoto.mimetype.split("/").pop();

        // Limit the photo type to jpg, jpeg and png only.
        const typeOfPhotoAllowed = ["image/jpeg", "image/jpg", "image/png"];
        const matchTypeOfPhoto = typeOfPhotoAllowed.includes(updateProfilePhoto.mimetype);

        // Limit the photo size up to 1MB only.
        const meetPhotoUploadSize = updateProfilePhoto.size <= 1 * 1024 * 1024 // 1MB

        return { updateProfilePhoto, photoExtension, matchTypeOfPhoto, meetPhotoUploadSize };
    },

    renderAWS: function(photoExtension, updateProfilePhoto, fs){
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

        return params;
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
        const dataPerPage = 8;
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
    renderUserInput: function(req){
        // User input from frontend side.
        const signupName = req.body.name;
        const signupEmail = req.body.email;
        const signupPassword = req.body.password;
        const updatePassword = req.body.updatePassword;

        // Use regex to verify the user input.
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
        res.cookie("token", token, {expires: expiryDate, httpOnly: false, secure: true, sameSite: true });
    },

    renderMemberData: function(res, memberData){
        res.status(200).json({"data": memberData});
    },

    renderEmailNotFound: function(res){
        res.status(400).json({"error": true, "message": "The email is not found"});
    },

    renderEmailIncorrect: function(res){
        res.status(400).json({"error": true, "message": "The email or password is not correct"});
    },

    renderEmailRegistered: function(res){
        res.status(400).json({"error": true, "message": "This email has been registered"});
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
    renderForbidden: view.renderForbidden,
    renderError: view.renderError,
    renderPhotoUpload: view.renderPhotoUpload,
    renderAWS: view.renderAWS,

    // Drama page.
    renderDramaQueryStringData: view.renderDramaQueryStringData,
    renderVideoAuth: view.renderVideoAuth,

    // Index page.
    renderVariables: view.renderVariables,
    renderDramaData: view.renderDramaData,

    // Signin page.
    renderUserInput: view.renderUserInput,
    renderJWTCookie: view.renderJWTCookie,
    renderMemberData: view.renderMemberData,
    renderEmailNotFound: view.renderEmailNotFound,
    renderEmailIncorrect: view.renderEmailIncorrect,
    renderEmailRegistered: view.renderEmailRegistered

};