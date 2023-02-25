const view = {

    // Common pages.
    renderSuccessfulData: function(result, res){
        res.status(200).json({"data": result});
    },
    renderSuccessful: function(res){
        res.status(200).json({"ok": true});
    },
    renderIncorrectFormat: function(res){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    },
    renderDataNotFound: function(res){
        res.status(400).json({"error": true, "message": "ID not found"});
    },
    renderForbidden: function(res){
        res.status(403).json({"error": true, "message": "forbidden"});
    },
    renderError: function(err, res, errorMessage){
        res.status(500).json({"error": true, "message": err.message});
        console.log(errorMessage);
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
    }

};

module.exports = {
    renderSuccessfulData: view.renderSuccessfulData,
    renderSuccessful: view.renderSuccessful,
    renderIncorrectFormat: view.renderIncorrectFormat,
    renderDataNotFound: view.renderDataNotFound,
    renderError: view.renderError,
    renderDramaQueryStringData: view.renderDramaQueryStringData,
    renderVideoAuth: view.renderVideoAuth
};