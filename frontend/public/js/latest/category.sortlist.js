import latestList from "./latest.list.js";

export default function categorySortlist(){

    // Global variables.
    let search;
    let totalPages;

    const model = {

        init: function(){

            // Resume to display all latest drame list button.
            function categoryListAllFunc(){
                $("#categoryListAll").click(() => {
                    // CSS and content clearance before button color change effect.
                    $("#popularPagination").text("");
                    $("#lastestSortlistPagination").text("");
                    $("#lastestListPagination").text("");
                    $("#categoryPagination").text("");
                    $("#categoryListAll").css("color", "rgb(2, 177, 247)");
                    $("#categoryListAll").css("border", "1px solid rgb(2, 177, 247)");
                    $("#latestSortlistAll").css("color", "rgb(2, 177, 247)");
                    $("#latestSortlistAll").css("border", "1px solid rgb(2, 177, 247)");

                    document.querySelectorAll(".category-list-title").forEach(result => {
                        result.style.color = "#000";
                        result.style.border = "none";
                    });
                    document.querySelectorAll(".latest-sortlist-title").forEach(result => {
                        result.style.color = "#000";
                        result.style.border = "none";
                    });

                    // Call back all latest drama list.
                    latestList();
                });
            };
            categoryListAllFunc();

            // Handle category sortlist item click.
            function categorySortlistItemsFunc(){
                document.querySelectorAll("div.category-list-title").forEach(result => {
                    result.addEventListener("click", async (e) => {

                        // CSS and content clearance before button color change effect.
                        function buttonColorChangeEffect(){
                            // Category sortlist button.
                            document.querySelectorAll(".category-list-title").forEach(result => {
                                result.style.color = "#000";
                                result.style.border = "none";
                            });

                            $("#categoryListAll").css("color", "#000");
                            $("#categoryListAll").css("border", "none");

                            // Week sortlist button.
                            document.querySelectorAll(".latest-sortlist-title").forEach(result => {
                                result.style.color = "#000";
                                result.style.border = "none";
                            });

                            $("#latestSortlistAll").css("color", "#000");
                            $("#latestSortlistAll").css("border", "none");
                            $(`#${e.target.attributes.id.value}`).css("color", "rgb(2, 177, 247)");
                            $(`#${e.target.attributes.id.value}`).css("border", "1px solid rgb(2, 177, 247)");
                            $("#latestSortlistAll").css("color", "rgb(2, 177, 247)");
                            $("#latestSortlistAll").css("border", "1px solid rgb(2, 177, 247)");
                        };
                        buttonColorChangeEffect();

                        function categoryListData(){
                            view.renderAddLoadingEffect();

                            search = e.target.attributes.id.value;

                            async function getData(url){
                                const response = await fetch(url);
                                const data = response.json();
                                return data;
                            };

                            return getData(`/api/drama?keyword=${search}`)
                            .then(data => {
                                if(data.data){
                                    view.renderCategoryList(data);
                                };
                            })
                            .catch(error => {
                                view.renderCategoryListError(error);
                            });
                        };
                        await categoryListData();

                        // Load pagination bar.
                        function loadPaginationBarFunc(){
                            // Clearance before loading the pagination bar.
                            $("#lastestListPagination").text("");
                            $("#lastestSortlistPagination").text("");
                            $("#popularPagination").text("");
                            $("#categoryPagination").text("");

                            for(let i = 1 ; i <= totalPages; i ++){
                                $("#categoryPagination").append(`
                                    <li id="categoryPagination${i}" class="page-item">
                                        <a class="page-link">${i}</a>
                                    </li>
                                `);
                            };

                            $(`#categoryPagination1`).attr("class", "page-item active");
                        };
                        loadPaginationBarFunc();
                    });
                });
            };
            categorySortlistItemsFunc();

            // Handle pagination click.
            function paginationClickFunc(){
                $("#categoryPagination").click((e) => {
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

                    getLatestDramaData(`/api/drama?page=${apiPageNum}&keyword=${search}`)
                    .then(data => {
                        if(data.data){
                            view.renderPaginationClick(data);
                        };
                    })
                    .catch(error => {
                        view.renderPaginationClickError(error);
                    });

                    // Pagination bar effect.
                    const currentPageElement = document.querySelector(`#categoryPagination${currentPageNum}`);
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

        renderCategoryList: function(data){
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

        renderCategoryListError: function(error){
            console.log("Error(category.sortlist.js): " + error);

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

        renderPaginationClickError: function(error){
            console.log("Error(category.sortlist.js -2): " + error);

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