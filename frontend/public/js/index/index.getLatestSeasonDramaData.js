export default function getLatestSeasonDramaData(){
    
    const latestDramaPhoto = document.querySelector('#latestDramaPhotoContainer');
    const latestDramaNextBtn = document.querySelector('#latestDramaNextBtn');
    const latestDramaPrevBtn = document.querySelector('#latestDramaPrevBtn');

    let currentIndx = 0;
    const cardsToShow = 6;
    let totalCards = 0;

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
                view.renderSlider();
                view.renderNextBtn();
                view.renderPrevBtn();
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
                data.data.map(result => {
                    $("#latestDramaPhotoContainer").append(`
                        <div class="latest-drama-photo" id="latestDramaPhoto">
                            <a href="/drama/${result.dramaID}">
                                <img class="latest-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                ${(result.dramaDownload.length) ? `<div class="latest-drama-video">線上觀看</div>` : ""}
                                <div class="latest-drama-photo-individual-title">${result.dramaTitle}</div>
                                <div class="latest-drama-photo-bottom-line"></div>
                            </a>
                        </div>
                    `);
                });

                totalCards = document.querySelectorAll('#latestDramaPhoto').length;

                // Show whole content (including latest, popular and timetable)
                setTimeout(() => {
                    $("#indexContentContainer").css("visibility", "visible");
                }, 50);

                view.renderRemoveLoadingEffect();
            };
        },

        renderSlider: function() {
            const offest = -currentIndx * 1200;
            latestDramaPhoto.style.transform = `translateX(${offest}px)`;
        },

        renderNextBtn: function(){
            latestDramaNextBtn.addEventListener('click', () => {
                if (currentIndx < (totalCards / cardsToShow) - 1) {
                    currentIndx++;
                    view.renderSlider();
                };
            });
        },

        renderPrevBtn: function(){
            latestDramaPrevBtn.addEventListener('click', () => {
                if (currentIndx > 0) {
                    currentIndx--;
                    view.renderSlider();
                };
            });
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