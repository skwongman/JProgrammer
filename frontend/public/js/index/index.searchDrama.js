export default function searchDrama(){

    const model = {

        init: function(){
            // Clear search bar value on each web initial load.
            searchBarInput.value = "";

            // Hide search bar menu after window click.
            $(document).on("click", (e) => {
                if(!$(e.target).is("div.a")){
                    $("#searchResult").css("display", "none");
                };
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
                };
            });

            // Handle search bar input.
            $("#searchBarInput").on("input", () => {
                view.renderAddLoadingEffect();

                async function searchKeyword(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                searchKeyword(`/api/drama/search?keyword=${searchBarInput.value}`)
                .then(data => {
                    view.renderSearchBarInput(data);
                })
                .catch(error => {
                    view.renderSearchBarInputError(error);
                });
            });

            // Handle search button click.
            $("#searchBarBtn").click(() => {
                view.renderAddLoadingEffect();

                async function searchKeyword(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };
            
                searchKeyword(`/api/drama/search?keyword=${searchBarInput.value}`)
                .then(data => {
                    view.renderSearchBarBtn(data);
                })
                .catch(error => {
                    view.renderSearchBarBtnError(error);
                });
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

        renderSearchBarInput: function(data){
            if(data.message == "The user input do not match with the designated format"){
                $("#searchResult").text("");

                view.renderRemoveLoadingEffect();
            };

            if(data.error && data.message == "ID not found"){
                $("#searchResult").html('<div class="search-no-result-text">抱歉，找不到任何相關劇集內容！</div>');

                view.renderRemoveLoadingEffect();
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
                    location.href = `/drama/${e.target.attributes.dramaID.value}`;
                });

                view.renderRemoveLoadingEffect();
            };
        },

        renderSearchBarInputError: function(error){
            searchBarInput.value = "";

            console.log("Error(index.searchDrama.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderSearchBarBtn: function(data){
            if(data.error && data.message == "ID not found"){
                alert("抱歉，找不到任何相關劇集內容！");

                view.renderRemoveLoadingEffect();
            };

            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("請輸入正確內容！");

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                location.href = `/drama/${data.data[0].dramaID}`;

                searchBarInput.value = "";

                view.renderRemoveLoadingEffect();
            };
        },

        renderSearchBarBtnError(error){
            console.log("Error(index.searchDrama.js - 2): " + error);
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};