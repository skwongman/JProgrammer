export default function getPopularDramaData(){
        
    const model = {

        init: function(){
            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };
        
            getData("/api/popular")
            .then(data => {
                view.render(data);
            })
            .catch(err => {
                view.renderError(err);
            });
        }

    };

    const view = {

        render: function(data){
            if(data.data){
                data.data.slice(0, 6).map(result => {
                    const shortenDramaTitle = result.dramaTitle.split("～")[0];

                    $("#popularDramaPhotoContainer").append(`
                        <div class="latest-drama-photo">
                            <a href="/drama/${result.dramaID}">
                                <img class="latest-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                <div class="latest-drama-photo-individual-title">${shortenDramaTitle}</div>
                                <div class="${shortenDramaTitle.length > 9 ? 'latest-drama-photo-bottom-line long-title' : 'latest-drama-photo-bottom-line'}"></div>
                            </a>
                        </div>
                    `);
                });
            };
        },
        
        renderError: function(err){
            console.log("Error(index.getPopularDramaData.js): " + err);
        }

    };

    const controller = {

        init: function(){
            model.init();
        }
        
    };
    controller.init();
    
};