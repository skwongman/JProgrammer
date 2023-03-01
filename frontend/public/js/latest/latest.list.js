export default function latestList(){

    // Global variable for total page no.
    let totalPages;

    const model = {

        init: async function(){

            // Web initial load data.
            function webInitialLoadFunc(){
                view.renderAddLoadingEffect();

                // Fetching API.
                async function getData(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                return getData("/api/drama")
                .then(data => {
                    if(data.data){
                        view.renderInitialLoad(data);
                    };
                })
                .catch(error => {
                    view.renderLoadPaginationBarError(error);
                });
            };
            await webInitialLoadFunc();

            // Load pagination bar.
            function loadPaginationBarFunc(){
                // Clearance before loading the pagination bar.
                $("#popularPagination").text("");
                $("#lastestSortlistPagination").text("");
                $("#lastestListPagination").text("");
                $("#categoryPagination").text("");

                // Load the pagination bar.
                for(let i = 1 ; i <= totalPages; i ++){
                    $("#lastestListPagination").append(`
                        <li id="pagination${i}" class="page-item">
                            <a class="page-link">${i}</a>
                        </li>
                    `)
                };

                $(`#pagination1`).attr("class", "page-item active");
                
            };
            loadPaginationBarFunc();

            // Handle pagination click.
            function paginationClickFunc(){
                // Remove the previous stored click event listener.
                $("#lastestListPagination").off("click");

                $("#lastestListPagination").click((e) => {
                    console.log($("#lastestListPagination"))
                    e.stopPropagation()
                    e.preventDefault()

                    const currentPage = e.target;
                    const pageNum = parseInt(e.target.text);
                    const apiPageNum = pageNum - 1;
                    const currentPageNum = pageNum;

                    if(currentPage.classList.contains("active")) return;

                    view.renderAddLoadingEffect();

                    // Resume the browser location to the top of the screen.
                    window.scrollTo(0, 0);

                    async function getLatestDramaData(url){
                        const response = await fetch(url);
                        const data = await response.json();
                        return data;
                    };

                    getLatestDramaData(`/api/drama?page=${apiPageNum}`)
                    .then(data => {
                        if(data.data){
                            view.renderPaginationClick(data);
                        };
                    })
                    .catch(error => {
                        view.renderPaginationClickError(error);
                    });

                    // Pagination bar effect.
                    const currentPageElement = document.querySelector(`#pagination${currentPageNum}`);
                    const previousInnerHTML = currentPageElement.innerHTML;
                    const results = document.querySelectorAll(`li.page-item`)

                    results.forEach(result => {
                        result.classList.remove("active");
                    });
                
                    currentPageElement.classList.add("active");
                    currentPageElement.innerHTML = `<span class="page-link">${currentPageNum}</span>`;
                    currentPageElement.innerHTML = previousInnerHTML;
                });
            };
            paginationClickFunc();

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderInitialLoad: function(data){
            totalPages = parseInt(data.totalPages);

            $("#latestListContainer").text("");

            data.data.map(result => {
                $("#latestListContainer").append(`
                    <div class="latest-list-drama">
                        <a href="/drama/${result.dramaID}">
                            <img class="latest-list-drama-photo" src="${result.dramaCoverPhoto}">
                            <div class="latest-list-drama-title">
                                <div>${result.dramaTitle.split("～")[0]}</div>
                                <div class="latest-list-drama-title-separator"></div>
                                <div class="latest-list-drama-date">更新日期: ${result.dramaCreatedTime.slice(0, 10)}</div>
                            </div>
                        </a>
                    </div>
                `)
            });

            // Show whole content
            $("#latestDramaListContentContainer").css("visibility", "visible");

            view.renderRemoveLoadingEffect();
        },

        renderPaginationClick: function(data){
            $("#latestListContainer").text("");

            data.data.map(result => {
                $("#latestListContainer").append(`
                    <div class="latest-list-drama">
                        <a href="/drama/${result.dramaID}">
                            <img class="latest-list-drama-photo" src="${result.dramaCoverPhoto}">
                            <div class="latest-list-drama-title">
                                <div>${result.dramaTitle.split("～")[0]}</div>
                                <div class="latest-list-drama-title-separator"></div>
                                <div class="latest-list-drama-date">更新日期: ${result.dramaCreatedTime.slice(0, 10)}</div>
                            </div>
                        </a>
                    </div>
                `);
            });

            // Show whole content
            $("#latestDramaListContentContainer").css("visibility", "visible");

            view.renderRemoveLoadingEffect();
        },

        renderLoadPaginationBarError: function(error){
            console.log("Error(latest.list.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderPaginationClickError: function(error){
            console.log("Error(latest.list.js - 2): " + error);

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