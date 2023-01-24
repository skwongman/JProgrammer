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
                data.data.map(result => {
                    $("#popularDramaContainer").append(`
                        <div class="latest-drama-photo">
                            <a href="/drama/${result.dramaID}">
                                <img class="latest-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                <div class="latest-drama-photo-individual-title">${result.dramaTitle}</div>
                            </a>
                        </div>
                    `);
                });
            };
        },
        renderError: function(err){
            console.log("JsError(2): " + err);
        }
    };

    const controller = {
        init: function(){
            model.init();
        }
    };
    controller.init();
    
};