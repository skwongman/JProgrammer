export default function getLatestSeasonDramaData(){
        
    const model = {
        init: function(){
            // Add loading effect
            topbar.show();

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
                    $("#latestDramaPhotoContainer").append(`
                        <div class="latest-drama-photo">
                            <a href="/drama/${result.dramaID}">
                                <img class="latest-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                ${(result.dramaDownload.length != 0) ? `<div class="latest-drama-video">線上觀看</div>` : ""}
                                <div class="latest-drama-photo-individual-title">${result.dramaTitle}</div>
                            </a>
                        </div>
                    `);
                });

                // Show whole content (including latest, popular and timetable)
                setTimeout(() => {
                    $("#indexContentContainer").css("visibility", "visible");
                }, 50);

                // Remove loading effect
                topbar.hide();
            };
        },
        renderError: function(err){
            console.log("JsError(1): " + err);

            // Remove loading effect
            topbar.hide();
        }
    };

    const controller = {
        init: function(){
            model.init();
        }
    };
    controller.init();
    
};