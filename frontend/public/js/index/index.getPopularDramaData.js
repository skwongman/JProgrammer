export default function getPopularDramaData(){

    const popularDramaPhoto = document.querySelector('#popularDramaPhotoContainer');
    const popularDramaNextBtn = document.querySelector('#popularDramaNextBtn');
    const popularDramaPrevBtn = document.querySelector('#popularDramaPrevBtn');

    let currentIndx = 0;
    const cardsToShow = 6;
    let totalCards = 0;
        
    const model = {

        init: function(){
            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };
        
            getData("/api/drama/popular")
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

        render: function(data){
            if(data.data){
                data.data.map(result => {
                    const shortenDramaTitle = result.dramaTitle.split("～")[0];

                    $("#popularDramaPhotoContainer").append(`
                        <div class="popular-drama-photo" id="popularDramaPhoto">
                            <a href="/drama/${result.dramaID}">
                                <img class="popular-drama-photo-individual" src="${result.dramaCoverPhoto}">
                                <div class="popular-drama-photo-individual-title">${shortenDramaTitle}</div>
                                <div class="${shortenDramaTitle.length > 9 ? 'latest-drama-photo-bottom-line long-title' : 'latest-drama-photo-bottom-line'}"></div>
                            </a>
                        </div>
                    `);
                });
                
                totalCards = document.querySelectorAll('#popularDramaPhoto').length;
            };
        },

        renderSlider: function() {
            const offest = -currentIndx * 1200;
            popularDramaPhoto.style.transform = `translateX(${offest}px)`;
        },

        renderNextBtn: function(){
            popularDramaNextBtn.addEventListener('click', () => {
                if (currentIndx < (totalCards / cardsToShow) - 1) {
                    currentIndx++;
                    view.renderSlider();
                };
            });
        },

        renderPrevBtn: function(){
            popularDramaPrevBtn.addEventListener('click', () => {
                if (currentIndx > 0) {
                    currentIndx--;
                    view.renderSlider();
                };
            });
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