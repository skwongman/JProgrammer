const { oauthClient } = require("../../commons/common");
const commonView = require("../../views/common.view");

const model = {

    init: async function(req, res){

		try {
			const userInfo = await oauthClient.request({
				url: 'https://www.googleapis.com/oauth2/v3/userinfo',
			});
			
			const memberData = {
				memberID: userInfo.data.sub,
				memberName: userInfo.data.name,
				memberEmail: userInfo.data.email,
				memberProfilePicture: userInfo.data.picture,
			}

			commonView.renderSuccessfulData(memberData, res);
		} catch (err) {
			commonView.renderSigninOauthStatusError(res);
		}

    }

};

module.exports = model.init;