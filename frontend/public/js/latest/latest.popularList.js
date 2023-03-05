export default function popularList(){

    // Gloal variable.
    let totalPages;

    const model = {

        init: function(){

            // Handle most popular list click.
            function mostPopularListFunc(){
                $("#mostPopularList").click(async () => {

                    function buttonColorChangeEffectFunc(){
                        document.querySelectorAll(".latest-sortlist-title").forEach(result => {
                            result.style.color = "#000";
                            result.style.border = "none";
                        });
    
                        $("#latestSortlistAll").css("color", "rgb(2, 177, 247)");
                        $("#latestSortlistAll").css("border", "1px solid rgb(2, 177, 247)");
                        $("#categoryListAll").css("color", "rgb(2, 177, 247)");
                        $("#categoryListAll").css("border", "1px solid rgb(2, 177, 247)");
                        $("#popularPagination").text("");
                        $("#lastestSortlistPagination").text("");
                        $("#lastestListPagination").text("");
                        $("#categoryPagination").text("");
    
                        document.querySelectorAll(".category-list-title").forEach(result => {
                            result.style.color = "#000";
                            result.style.border = "none";
                        });
                    };
                    buttonColorChangeEffectFunc();

                    function latestPopularListData(){
                        view.renderAddLoadingEffect();

                        async function getData(url){
                            const response = await fetch(url);
                            const data = response.json();
                            return data;
                        };

                        return getData("/api/drama/popular")
                        .then(data => {
                            view.renderLatestPopularList(data);
                        })
                        .catch(error => {
                            view.renderLatestPopularListError(error);
                        });
                    };
                    await latestPopularListData();

                    function loadPaginationBarFunc(){
                        // Clearance before loading the pagination bar.
                        $("#popularPagination").text("");
                        $("#lastestSortlistPagination").text("");
                        $("#lastestListPagination").text("");
                        $("#categoryPagination").text("");

                        for(let i = 1 ; i <= totalPages; i ++){
                            $("#popularPagination").append(`
                                <li id="popularPagination${i}" class="page-item">
                                    <a class="page-link">${i}</a>
                                </li>
                            `)
                        };

                        document.querySelector(`#popularPagination1`).className = "page-item active";
                    };
                    loadPaginationBarFunc();

                });
            };
            mostPopularListFunc();

            // Load pagination bar.
            function loadPaginationBarFunc(){
                $("#popularPagination").click((e) => {
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

                    getLatestDramaData(`/api/drama/popular?page=${apiPageNum}`)
                    .then(data => {
                        if(data.data){
                            view.renderPaginationBar(data);
                        };
                    })
                    .catch(error => {
                        view.renderPaginationBarError(error);
                    })
                
                    // Pagination bar effect.
                    const currentPageElement = document.querySelector(`#popularPagination${currentPageNum}`);
                    const previousInnerHTML = currentPageElement.innerHTML;
                    const results = document.querySelectorAll(`li.page-item`)
                    results.forEach(result => {
                        result.classList.remove("active");
                    });
                
                    currentPageElement.classList.add("active");
                    currentPageElement.innerHTML = `<span class="page-link">${currentPageNum}</span>`;
                
                    setTimeout(() => {
                        currentPageElement.innerHTML = previousInnerHTML;
                    }, 0);
                });
            };
            loadPaginationBarFunc();

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderLatestPopularList: function(data){
            totalPages = parseInt(data.totalPages);

            $("#latestListContainer").text("");
    
            for(let i = 0; i < data.data.length; i ++){
                $("#latestListContainer").append(`
                    <div class="latest-list-drama">
                        <a href="/drama/${data.data[i].dramaID}">
                            <img class="latest-list-drama-photo" src="${data.data[i].dramaCoverPhoto}">
                            <div class="latest-list-drama-title">
                                <div>${data.data[i].dramaTitle.split("～")[0]}</div>
                                <div class="latest-list-drama-title-separator"></div>
                                <div class="latest-list-drama-date">更新日期: ${data.data[i].dramaCreatedTime.slice(0, 10)}</div>
                            </div>
                        </a>
                    </div>
                `);
            };

            view.renderRemoveLoadingEffect();
        },

        renderLatestPopularListError: function(error){
            console.log("Error(latest.popularList.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderPaginationBar: function(data){
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

        renderPaginationBarError: function(error){
            console.log("Error(latest.popularList.js - 2): " + error);

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