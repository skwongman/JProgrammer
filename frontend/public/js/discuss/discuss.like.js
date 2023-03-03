export default function discussLike(){

    // check if the user has already liked this post on web initial load.
    const likePostId = $(".discuss-post-like-click").data("likeId");

    if(localStorage.getItem(likePostId) === "liked"){
        $(".discuss-post-like-click").attr("src", "/img/icon_like_after.png");
        $("#likePostCount").css("color", "rgb(2, 177, 247)");
    };

    const model = {

        init: function(){

            // Handle like "post" button click.
            function likePostBtnClickFunc(){
                $(".discuss-post-like-click").click(() => {

                    view.renderAddLoadingEffect();

                    async function userAuth(url){
                        const response = await fetch(url);
                        const data = await response.json();
                        return data;
                    };

                    userAuth("/api/user/auth")
                    .then(data => {
                        view.renderLikePostUserAuth(data);
                    })
                    .catch(error => {
                        view.renderLikePostUserAuthError(error);
                    });
                    
                });
            };
            likePostBtnClickFunc();

            // Handle like "reply" button click.
            function likeReplyBtnClickFunc(){
                const likeButtons = document.querySelectorAll(".discuss-reply-like-click");

                likeButtons.forEach(button => {
                    const likeReplyId = button.dataset.likeId;

                    // check if the user has already liked this post on web initial load.
                    if(localStorage.getItem(likeReplyId) === "liked"){
                        $(`#${button.attributes.id.value}`).attr("src", "/img/icon_like_after.png");
                        $(`#id${button.attributes.id.value}`).css("color", "rgb(2, 177, 247)");
                    };

                    button.addEventListener("click", () => {

                        view.renderAddLoadingEffect();
                
                        async function userAuth(url){
                            const response = await fetch(url);
                            const data = await response.json();
                            return data;
                        };

                        userAuth("/api/user/auth")
                        .then(data => {
                            view.renderReplyPostUserAuth(data, button, likeReplyId);
                        })
                        .catch(error => {
                            view.renderReplyPostUserAuthError(error);
                        });

                    });
                });
            };
            likeReplyBtnClickFunc();

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderLikePostUserAuth: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            }
            else if(data.data){
                const likePostID = $(".discuss-post-like-click").attr("id");
                
                async function addLikeCount(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };

                addLikeCount("/api/discuss/like", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        "likePostID": likePostID
                    })
                })
                .then(data => {
                    view.renderLikePostData(data);
                })
                .catch(error => {
                    view.renderLikePostDataError(error);
                });
            };
        },

        renderLikePostUserAuthError: function(error){
            console.log("Error(discuss.like.js - 1): " + error);
        },

        renderLikePostData: function(data){
            if(data.data == 0){
                $("#likePostCount").text("0");
                localStorage.removeItem(likePostId);
                $(".discuss-post-like-click").attr("src", "/img/icon_like.png");
                $("#likePostCount").css("color", "#000");

                view.renderRemoveLoadingEffect();
            }
            else if(data.data){
                $("#likePostCount").text(data.data);

                // Change the like button color by using local storage.
                if(localStorage.getItem(likePostId) === "liked"){
                    localStorage.removeItem(likePostId);
                    $(".discuss-post-like-click").attr("src", "/img/icon_like.png");
                    $("#likePostCount").css("color", "#000");
                }
                else{
                    localStorage.setItem(likePostId, "liked");
                    $(".discuss-post-like-click").attr("src", "/img/icon_like_after.png");
                    $("#likePostCount").css("color", "rgb(2, 177, 247)");
                };

                view.renderRemoveLoadingEffect();
            };
        },

        renderLikePostDataError: function(error){
            console.log("Error(discuss.post.js - 6): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderReplyPostUserAuth: function(data, button, likeReplyId){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                const likePostID = button.attributes.id.value;
        
                async function addLikeCount(url, method){
                    const response = await fetch(url, method);
                    const data = await response.json();
                    return data;
                };
    
                addLikeCount("/api/discuss/like", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        "likePostID": likePostID
                    })
                })
                .then(data => {
                    view.renderReplyPostData(data, likePostID, likeReplyId);
                })
                .catch(error => {
                    view.renderReplyPostDataError(error);
                });
            };
        },

        renderReplyPostUserAuthError: function(error){
            console.log("Error(discuss.post.js - 7): " + error);
            
            view.renderRemoveLoadingEffect();
        },

        renderReplyPostData: function(data, likePostID, likeReplyId){
            if(data.data == 0){
                $(`#id${likePostID}`).text("0");
                localStorage.removeItem(likeReplyId);
                $(`#${likePostID}`).attr("src", "/img/icon_like.png");
                $(`#id${likePostID}`).css("color", "#000");

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                $(`#id${likePostID}`).text(data.data);

                // Change the like button color by using local storage.
                if(localStorage.getItem(likeReplyId) === "liked"){
                    localStorage.removeItem(likeReplyId);
                    $(`#${likePostID}`).attr("src", "/img/icon_like.png");
                    $(`#id${likePostID}`).css("color", "#000");
                }
                else{
                    localStorage.setItem(likeReplyId, "liked");
                    $(`#${likePostID}`).attr("src", "/img/icon_like_after.png");
                    $(`#id${likePostID}`).css("color", "rgb(2, 177, 247)");
                };

                view.renderRemoveLoadingEffect();
            };
        },

        renderReplyPostDataError: function(error){
            console.log("Error(discuss.post.js - 7): " + error);
    
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