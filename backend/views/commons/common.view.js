const view = {

    renderSuccessful: function(result, res){
        res.status(200).json({"data": result});
    },

    renderIncorrectFormat: function(res){
        res.status(400).json({"error": true, "message": "The user input do not match with the designated format"});
    },

    renderDataNotFound: function(res){
        res.status(400).json({"error": true, "message": "not found"});
    },

    renderError: function(err, res, errorMessage){
        res.status(500).json({"error": true, "message": err.message});
        console.log(errorMessage);
    }

};

module.exports = {
    renderSuccessful: view.renderSuccessful,
    renderIncorrectFormat: view.renderIncorrectFormat,
    renderDataNotFound: view.renderDataNotFound,
    renderError: view.renderError
};