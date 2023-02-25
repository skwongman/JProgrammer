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
        // Determine the total pages.
        const totalPages = Math.ceil(count / dataPerPage);

        res.status(200).json({"totalPages": totalPages, "nextPage": nextPage, "data": data});
    }

};

module.exports = {
    renderSuccessfulData: view.renderSuccessfulData,
    renderSuccessful: view.renderSuccessful,
    renderIncorrectFormat: view.renderIncorrectFormat,
    renderDataNotFound: view.renderDataNotFound,
    renderError: view.renderError,
    renderDramaQueryStringData: view.renderDramaQueryStringData,
    renderVideoAuth: view.renderVideoAuth,
    renderVariables: view.renderVariables,
    renderDramaData: view.renderDramaData
};