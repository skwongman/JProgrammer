const view = {

    // Declare variables.
    renderVariables: function(req){
        const dataPerPage = 6;
        const keyword = req.query.keyword || null;
        const page = parseInt(req.query.page) || 0;
        const dataOrderPerPage = page * dataPerPage; // e.g. Page 0: 1-6, Page 1: 7-12, etc.

        return { dataPerPage, keyword, page, dataOrderPerPage };
    },

    // Drama API data.
    renderDramaData: function(result, res, dataOrderPerPage, dataPerPage, page){
        // Determine nextPage value.
        const data = result[0].data;
        const count = result[0].metadata[0].count;
        const nextPage = (count > dataOrderPerPage + dataPerPage) ? page + 1 : null;
        // Determine the total pages.
        const totalPages = Math.ceil(count / dataPerPage);

        res.status(200).json({"totalPages": totalPages, "nextPage": nextPage, "data": data});
    },

};

module.exports = {
    renderVariables: view.renderVariables,
    renderDramaData: view.renderDramaData
};