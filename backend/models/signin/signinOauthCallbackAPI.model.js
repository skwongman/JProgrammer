const jwt = require("jsonwebtoken");
const { oauthClient } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: async function(req, res){

		const { code } = req.query;

		try {
			const { tokens } = await oauthClient.getToken(code);
			oauthClient.setCredentials(tokens);

			const userInfo = await oauthClient.request({
				url: 'https://www.googleapis.com/oauth2/v3/userinfo'
			});

			commonView.renderOauthJWTCookie(res, jwt, userInfo);
		} catch (err) {
			commonView.renderSigninOauthStatusError(res);
		}

    }

};

module.exports = model.init;