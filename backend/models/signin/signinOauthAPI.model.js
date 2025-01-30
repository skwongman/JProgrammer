const { oauthClient } = require("../../commons/common");

const model = {

    init: function(req, res){

        const authorizeUrl = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ],
        });
        
        res.redirect(authorizeUrl);

    }

};

module.exports = model.init;