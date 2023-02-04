export default function popularList(){

    // Most popular list button.
    $("#mostPopularList").click(() => {

        document.querySelectorAll(".latest-sortlist-title").forEach(result => {
            result.style.color = "#000";
            result.style.border = "none";
        });

        // Week list button color change effect.
        $("#latestSortlistAll").css("color", "rgb(2, 177, 247)");
        $("#latestSortlistAll").css("border", "1px solid rgb(2, 177, 247)");

        // Category list button color change effect.
        $("#categoryListAll").css("color", "rgb(2, 177, 247)");
        $("#categoryListAll").css("border", "1px solid rgb(2, 177, 247)");

        // CSS and content clearance before button color change effect.
        // $("#latestListContainer").text("");
        $("#popularPagination").text("");
        $("#lastestSortlistPagination").text("");
        $("#lastestListPagination").text("");
        $("#categoryPagination").text("");
        document.querySelectorAll(".category-list-title").forEach(result => {
            result.style.color = "#000";
            result.style.border = "none";
        });

        // Add loading effect.
        topbar.show();

        async function getData(url){
            const response = await fetch(url);
            const data = response.json();
            return data;
        };

        getData("/api/popular/list")
        .then(data => {
            const totalPages = parseInt(data.totalPages);

            callbackTotalPages(totalPages);

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

            // Remove loading effect
            topbar.hide();
        })
        .catch(error => {
            console.log("Error(latest.popularList.js): " + error);

            // Remove loading effect
            topbar.hide();
        });

        // Clearance before loading the pagination bar.
        $("#popularPagination").text("");
        $("#lastestSortlistPagination").text("");
        $("#lastestListPagination").text("");
        $("#categoryPagination").text("");

        // Load the pagination bar.
        function callbackTotalPages(callbackTotalPages){
            for(let i = 1 ; i <= callbackTotalPages; i ++){
                $("#popularPagination").append(`
                    <li id="popularPagination${i}" class="page-item">
                        <a class="page-link">${i}</a>
                    </li>
                `)
            };
            document.querySelector(`#popularPagination1`).className = "page-item active";
        };

    });

    // Pagination
    $("#popularPagination").click((e) => {
        const currentPage = e.target;
        const pageNum = parseInt(e.target.text);
        const apiPageNum = pageNum - 1;
        const currentPageNum = pageNum;

        if(currentPage.classList.contains("active")) return;

        // Add loading effect
        topbar.show();

        // Resume the browser location to the top of the screen.
        window.scrollTo(0, 0);

        async function getLatestDramaData(url){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        getLatestDramaData(`/api/popular/list?page=${apiPageNum}`)
        .then(data => {
            if(data.data){
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
    
                // Remove loading effect
                topbar.hide();
            };
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