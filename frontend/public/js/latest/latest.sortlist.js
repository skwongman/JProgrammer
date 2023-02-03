import latestList from "./latest.list.js";

export default function latestSortlist(){

    // Resume to display all latest drame list button.
    $("#latestSortlistWeekAll").click(() => {
        // CSS and content clearance before button color change effect.
        $("#latestListContainer").text("");
        $("#lastestSortlistPagination").text("");
        document.querySelectorAll(".latest-sortlist-week-title").forEach(result => {
            result.style.color = "#000";
            result.style.border = "none";
        });

        // Button color change effect.
        $("#latestSortlistWeekAll").css("color", "rgb(2, 177, 247)");
        $("#latestSortlistWeekAll").css("border", "1px solid rgb(2, 177, 247)");

        // Call back all latest drama list.
        latestList();
    });

    // Week shortlist buttons.
    document.querySelectorAll("div.latest-sortlist-week-title").forEach(result => {
        result.addEventListener("click", (e) => {
            // Add loading effect
            topbar.show();

            // CSS and content clearance before button color change effect.
            document.querySelectorAll(".latest-sortlist-week-title").forEach(result => {
                result.style.color = "#000";
                result.style.border = "none";
            });
            $("#latestSortlistWeekAll").css("color", "#000");
            $("#latestSortlistWeekAll").css("border", "none");

            // Button color change effect.
            $(`#${e.target.attributes.id.value}`).css("color", "rgb(2, 177, 247)");
            $(`#${e.target.attributes.id.value}`).css("border", "1px solid rgb(2, 177, 247)");

            // Fetching API.
            const weekSearch = e.target.attributes.id.value;

            async function getData(url){
                const response = await fetch(url);
                const data = response.json();
                return data;
            };

            getData(`/api/latest?keyword=${weekSearch}`)
            .then(data => {
                if(data.data){
                    const currentPage = parseInt(data.currentPage + 1);

                    callbackCurrentPage(currentPage);

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
    
                    // Remove loading effect.
                    topbar.hide();
                };
            })
            .catch(error => {
                console.log("Error(latest.sortlist.js): " + error);

                // Remove loading effect;
                topbar.hide();
            });

            // Load the pagination bar.
            function callbackCurrentPage(callbackPageNum){
                for(let i = 1 ; i <= callbackPageNum; i ++){
                    $("#lastestListPagination").text("");
                    $("#lastestSortlistPagination").text("");
            
                    $("#lastestSortlistPagination").append(`
                        <li id="sortlist${i}" class="page-item">
                            <a class="page-link">${i}</a>
                        </li>
                    `);
                };

                $(`#sortlist1`).attr("class", "page-item active");
            };
        });
    });
};