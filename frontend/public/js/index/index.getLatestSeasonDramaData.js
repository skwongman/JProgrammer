export default function getLatestSeasonDramaData(){
        
    const model = {

        init: function(){
            view.renderAddLoadingEffect();

            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };
        
            getData("/api/drama")
            .then(data => {
                view.render(data);
            })
            .catch(err => {
                view.renderError(err);
            });
        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        render: function(data){
            if(data.data){
                data.data.slice(0, 6).map(result => {
                    const shortenDramaTitle = result.dramaTitle.split("～")[0];

                    $("#latestDramaPhotoContainer").append(`
                        <div class="latest-drama-photo">
                            <a href="/drama/${result.dramaID}">
                                <img class="latest-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                ${(result.dramaDownload.length != 0) ? `<div class="latest-drama-video">線上觀看</div>` : ""}
                                <div class="latest-drama-photo-individual-title">${shortenDramaTitle}</div>
                                <div class="latest-drama-photo-bottom-line"></div>
                            </a>
                        </div>
                    `);
                });

                // Show whole content (including latest, popular and timetable)
                setTimeout(() => {
                    $("#indexContentContainer").css("visibility", "visible");
                }, 50);

                view.renderRemoveLoadingEffect();
            };
        },
        renderError: function(err){
            console.log("Error(index.getLatestSeasonDramaData.js): " + err);

            view.renderRemoveLoadingEffect();
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();
    
};