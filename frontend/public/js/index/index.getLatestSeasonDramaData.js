export default function getLatestSeasonDramaData(){
        
    const model = {
        init: function(){
            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };
        
            getData("/api/drama?page=0")
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
                    $("#latestDramaContainer").append(`
                        <div class="col">
                            <div class="card h-100">
                                <img src="${result.dramaCoverPhoto}" class="card-img-top">
                                <div class="card-body">
                                    <h5 class="card-title">${result.dramaTitle}</h5>
                                </div>
                            </div>
                        </div>
                    `);
                });
            };
        },
        renderError: function(err){
            console.log("JsError(1): " + err);
        }
    };

    const controller = {
        init: function(){
            model.init();
        }
    };
    controller.init();
    
};