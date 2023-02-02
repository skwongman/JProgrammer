export default function latestList(){

    // Add loading effect
    topbar.show();

    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getData("/api/drama")
    .then(data => {
        if(data.data){
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






    for(let i = 1 ; i <= 10; i ++){
        $("#lastestListPagination").append(`
            <li id="p${i}" class="page-item">
                <a class="page-link">${i}</a>
            </li>
        `)

        // if(i == 10){
        //     $("#lastestListPagination").append(`
        //         <li id="nextPage" class="page-item">
        //             <a class="page-link">下一頁</a>
        //         </li>
        //     `)
        // };
    };
    
    document.querySelector(`#p1`).className = 'page-item active'



    // Pagination
    $("#lastestListPagination").click((e) => {
        const currentPage = e.target;

        if (currentPage.classList.contains("active")) return;
    
        const pageNum = parseInt(e.target.text);
        // if(isNaN(pageNum) || e.target.text == "下一頁"){
        //     return
        // };
    
        // if(pageNum == '10'){
        //     document.querySelector("#nextPage").classList.add("disabled")
        // }
        // else{
        //     document.querySelector("#nextPage").classList.remove("disabled")
        // }

        // if(pageNum == '1'){
        //     document.querySelector("#prevPage").classList.add("disabled")
        // }
        // else{
        //     document.querySelector("#prevPage").classList.remove("disabled")
        // }

        const apiPageNum = pageNum - 1;
        const currentPageNum = pageNum;

        // Add loading effect
        topbar.show();

        fetch(`/api/drama?page=${apiPageNum}`)
        .then(response => response.json())
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
                    `)
                });
    
                // Show whole content
                $("#latestDramaListContentContainer").css("visibility", "visible");
    
                // Remove loading effect
                topbar.hide();
            };
        })
    
        const currentPageElement = document.querySelector(`#p${currentPageNum}`);
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