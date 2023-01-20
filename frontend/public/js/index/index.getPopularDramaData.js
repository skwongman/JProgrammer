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
                        <div class="col">
                            <a href="https://localhost:5000/drama/${result.dramaID}">
                                <div class="card h-100">
                                    <img src="${result.dramaCoverPhoto}" class="card-img-top">
                                    <div class="card-body">
                                        <h5 class="card-title">${result.dramaTitle}</h5>
                                    </div>
                                </div>
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