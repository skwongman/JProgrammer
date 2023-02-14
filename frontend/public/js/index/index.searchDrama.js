export default function searchDrama(){
    
    // Clear search bar value on each web initial load.
    searchBarInput.value = "";

    // Hide search bar menu after window click.
    $(document).on("click", (e) => {
        if (!$(e.target).is("div.a")) {
            $("#searchResult").css("display", "none");
        }
    });

    // Show the search bar after click the search bar itself.
    $("#searchBarInput").click((e) => {
        if($("#searchResult").css("display") == "none"){
            $("#searchResult").css("display", "block");
            e.stopPropagation();
        }
        else{
            $("#searchResult").css("display", "none");
            e.stopPropagation();
        }
    });

    // Handle search bar input.
    $("#searchBarInput").on("input", () => {

        // Add loading effect
        topbar.show();

        async function searchKeyword(url){
            const response = await fetch(url);
            const data = await response.json();
            return data;
        };

        searchKeyword(`/api/search?keyword=${searchBarInput.value}`)
        .then(data => {
            if(data.message == "The user input do not match with the designated format"){
                $("#searchResult").text("");

                // Remove loading effect
                topbar.hide();
            };

            if(data.error && data.message == "not found"){
                // $("#searchResult").css("display", "none");

                $("#searchResult").html('<div class="search-no-result-text">抱歉，找不到任何相關劇集內容！</div>');

                // Remove loading effect
                topbar.hide();
            };

            if(data.data){
                $("#searchResult").text("");

                $("#searchResult").css("display", "block");

                data.data.map(result => {
                    $("#searchResult").append(`
                        <div id=dramaTitle dramaID="${result.dramaID}" class="search-result-text">${result.dramaTitle}</div>
                    `);
                });
    
                $(`div#dramaTitle`).click((e) => {
                    searchBarInput.value = "";

                    $("#searchResult").css("display", "none");

                    location.href = `/drama/${e.target.attributes.dramaID.value}`
                });

                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            searchBarInput.value = "";

            console.log("Error(index.searchDrama.js): " + error);

            // Remove loading effect
            topbar.hide();
        });
    });

    // Handle search button click.
    $("#searchBarBtn").click(() => {
        // Add loading effect
        topbar.show();

        async function searchKeyword(url, method){
            const response = await fetch(url, method);
            const data = await response.json();
            return data;
        };
    
        searchKeyword(`/api/search?keyword=${searchBarInput.value}`)
        .then(data => {
            if(data.error && data.message == "not found"){
                alert("抱歉，找不到任何相關劇集內容！");

                // Remove loading effect
                topbar.hide();
            };

            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("請輸入正確內容！");

                // Remove loading effect
                topbar.hide();
            };

            if(data.data){
                location.href = `/drama/${data.data[0].dramaID}`;

                searchBarInput.value = "";

                // Remove loading effect
                topbar.hide();
            };
        })
        .catch(error => {
            console.log("Error(index.searchDrama.js): " + error);
        });
    });

};