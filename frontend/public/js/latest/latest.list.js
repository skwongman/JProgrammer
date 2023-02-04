export default function latestList(){

    // Add loading effect.
    topbar.show();

    // Fetching API.
    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getData("/api/latest")
    .then(data => {
        if(data.data){
            const totalPages = parseInt(data.totalPages);

            callbackTotalPages(totalPages);

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

            // Remove loading effect
            topbar.hide();
        };
    })
    .catch(error => {
        console.log("Error(latest.list.js): " + error);

        // Remove loading effect
        topbar.hide();
    });

    // Clearance before loading the pagination bar.
    $("#popularPagination").text("");
    $("#lastestSortlistPagination").text("");
    $("#lastestListPagination").text("");
    $("#categoryPagination").text("");

    // Load the pagination bar.
    // for(let i = 1 ; i <= 9; i ++){
    //     $("#lastestListPagination").append(`
    //         <li id="pagination${i}" class="page-item">
    //             <a class="page-link">${i}</a>
    //         </li>
    //     `)

        // if(i == 9){
        //     $("#lastestListPagination").append(`
        //         <li id="nextPage" class="page-item">
        //             <a class="page-link">下一頁</a>
        //         </li>
        //     `)
        // };
    // };
    // document.querySelector(`#pagination1`).className = "page-item active";




    // Load the pagination bar.
    function callbackTotalPages(callbackTotalPages){
        for(let i = 1 ; i <= callbackTotalPages; i ++){
            $("#lastestListPagination").append(`
                <li id="pagination${i}" class="page-item">
                    <a class="page-link">${i}</a>
                </li>
            `)
        };

        $(`#pagination1`).attr("class", "page-item active");
    };




    // Pagination
    $("#lastestListPagination").click((e) => {
        const currentPage = e.target;
        const pageNum = parseInt(e.target.text);
        const apiPageNum = pageNum - 1;
        const currentPageNum = pageNum;

        if(currentPage.classList.contains("active")) return;
    
        // if(isNaN(pageNum) || e.target.text == "下一頁"){
        //     return
        // };
    
        // if(pageNum == "10"){
        //     document.querySelector("#nextPage").classList.add("disabled")
        // }
        // else{
        //     document.querySelector("#nextPage").classList.remove("disabled")
        // }

        // if(pageNum == "1"){
        //     document.querySelector("#prevPage").classList.add("disabled")
        // }
        // else{
        //     document.querySelector("#prevPage").classList.remove("disabled")
        // }


        // Add loading effect
        topbar.show();

        // Resume the browser location to the top of the screen.
        window.scrollTo(0, 0);

        async function getLatestDramaData(url){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        getLatestDramaData(`/api/latest?page=${apiPageNum}`)
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
        const currentPageElement = document.querySelector(`#pagination${currentPageNum}`);
        const previousInnerHTML = currentPageElement.innerHTML;
        const results = document.querySelectorAll(`li.page-item`)
        results.forEach(result => {
            result.classList.remove("active");
        });
    
        currentPageElement.classList.add("active");
        currentPageElement.innerHTML = `<span class="page-link">${currentPageNum}</span>`;
    

        currentPageElement.innerHTML = previousInnerHTML;
        // setTimeout(() => {
        //     currentPageElement.innerHTML = previousInnerHTML;
        // }, 0);
    });

};