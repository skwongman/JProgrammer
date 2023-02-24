import discussChat from "./discuss.chat.js";

export default function discussPost(){

    // Add loading effect
    topbar.show();

    // Clear all the input value on web initial load.
    $("#discussReply").val("");

    // Fetching discuss post data on web initial load.
    let discussPostID = location.href.split("/").pop();
    let totalPages;

    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getData(`/api/discuss/${discussPostID}`)
    .then(data => {

        if(data.error && data.message == "ID not found"){
            location.href = "/";
        };

        const discussData = data.data;
        const replyData = data.data.discussReply;
        const pageNo = location.href.split("page=").pop();
        totalPages = data.totalPages;

        // Redirect to the home page if not existing page is input.
        if(pageNo == "0" || pageNo > totalPages){
            location.href = "/";
        };

        if(discussData){
            // Main header.
            $("#discussMainHeader").text(`討論：${discussData.discussDramaTitle}`);

            // Show only the first post on page 1.
            if(pageNo == "1"){
                $("#discussPostContainer").css("display", "block");
                $("#discussHeader").text(`[${discussData.discussDramaTitle}] ${discussData.discussHeader}`);
                $("#replyMemberProfilePicture").attr("src", discussData.discussMemberID[0].memberProfilePicture);
                $("#replyMemberProfilePicture").attr("chat", discussData.discussMemberID[0]._id);
                $("#replyMemberProfilePicture").attr("post", "1");
                $("#replyMemberName").append(`${discussData.discussMemberID[0].memberName}`);
                $("#replyMemberName").attr("class", `c1${discussData.discussMemberID[0]._id}`);
                $("#discussCreatedTime").text(` 於 ${discussData.discussCreatedTime.split(".")[0].slice(0, 16).replace(" ", ", ")} 發佈`);
                $("#discussContent").append(discussData.discussContent);
                $(".discuss-post-like-click").attr("id", discussData.discussID);
                $(".discuss-post-like-click").attr("data-like-id", discussData.discussID + document.cookie.slice(-6));
                (discussData.likePostCount.length == 0) ? 0 : $("#likePostCount").text(discussData.likePostCount.length);
            };

            // Reply content.
            for(let i = 0; i < replyData.length; i ++){
                $("#replyPostContainer").append(`
                    <div class="discuss-content">

                        <!-- Reply content -->
                        <div class="discuss-title">
                            <div class="discuss-title-user-profile">
                                <img id="replyMemberProfilePicture" class="discuss-title-user-profile-picture" src="${replyData[i].replyMemberID[0].memberProfilePicture}" chat="${replyData[i].replyMemberID[0].memberID}" post="${replyData[i].replyNo}">
                            </div>
                            <div class="discuss-title-user-content">
                                <div>
                                    <span>#${replyData[i].replyNo}</span>
                                    <span id="replyMemberName" class="c${replyData[i].replyNo}${replyData[i].replyMemberID[0].memberID}">${replyData[i].replyMemberID[0].memberName}</span>
                                    <span id="replyCreatedTime"> 於 ${replyData[i].replyCreatedTime.split(".")[0].slice(0, 16).replace(" ", ", ")} 回覆</span>
                                </div>
                            </div>
                        </div>
                        <div id="replyContent${replyData[i].replyNo}" class="discuss-post">${replyData[i].replyContent}</div>

                        <!-- Like and quote buttons -->
                        <div class="discuss-reply">
                            <img id="${replyData[i].replyID}" class="discuss-reply-like-click" data-like-id="like${replyData[i].replyID + document.cookie.slice(-6)}" src="/img/icon_like.png">
                            <div id="id${replyData[i].replyID}" class="discuss-reply-like-count">${(replyData[i].likeReplyCount.length == 0) ? 0 : replyData[i].likeReplyCount.length}</div>
                
                            <img id="${replyData[i].replyNo}" class="discuss-reply-quote-icon" src="/img/icon_reply.png">
                            <span class="discuss-reply-quote">引用</span>
                        </div>

                    </div>
                `);
            };

            // Show the whole content.
            setTimeout(() => {
                $("#discussContentContainer").css("visibility", "visible");
            }, 300);

            // Remove loading effect.
            topbar.hide();
        };
    })
    .then(() => {
        discussChat();
    })
    .then(() => {
        // Pagination
        discussPostID = discussPostID.split("?")[0];
        const currentpage = location.href.split("page=").pop();
        
        for(let i = 0; i < totalPages; i ++){
            if(i + 1 == currentpage){
                $("#pagination").append(`
                    <li id="page${i + 1}" class="page-item">
                        <span class="page-link">${i + 1}</span>
                    </li>
                `);
            }
            else{
                $("#pagination").append(`
                    <li id="page${i + 1}" class="page-item">
                        <a class="page-link" href="/discuss/${discussPostID}?page=${i + 1}">${i + 1}</a>
                    </li>
                `);
            };
        };

        document.querySelector(`#page${currentpage}`).className = "page-item active";
    })
    .then(() => {
        // Froala Editor library setting.
        const editor = new FroalaEditor("#discussReply", {
            attribution: false, // remove powered by label.
            charCounterCount: false, // remove word count.
            quickInsertEnabled: false, // remove quick edit button.
            placeholderText: "請輸入回覆內容",
            fontSizeSelection: true,
            height: 350,
            language: "zh_tw",
            toolbarButtons: ["fontSize", "bold", "italic", "underline", "strikeThrough", "textColor", "quote", "insertHR", "align", "insertImage"]
        });

        // Handle discuss reply button click.

        // If the no. of pages is reached to 11, reply post function will be disabled.
        if(totalPages >= "11"){
            $("#discussReplyBtn").css("display", "none");
        }
        else{
            $("#discussReplyBtn").css("display", "block");
        };

        $("#discussReplyBtn").click(() => {

            // Add loading effect
            topbar.show();

            async function userAuth(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };

            userAuth("/api/user/auth")
            .then(data => {
                if(data.error && data.message == "forbidden" || totalPages >= "11"){
                    location.href = "/signin";

                    // Remove loading effect
                    topbar.hide();
                }
                else if(data.data){
                    if($("#discussReplyBtn").text() == "回覆"){
                        $("#discussReplyContainer").css("display", "block");
                        $("#discussCancelBtn").css("display", "block");
                        $("#discussReplyBtnWidth").css("flex", "none");
                        $("#discussReplyBtnWidth").css("width", "90px");
                        $("#discussCancelBtnWidth").css("flex", "none");
                        $("#discussCancelBtnWidth").css("width", "90px");
                        $("#discussReplyBtn").text("送出");

                        // Remove loading effect
                        topbar.hide();
                    }
                    else{
                        // Get the image temp url link.
                        const tempPhotoData = new FormData();
                        const regex = /<img[^>]+src="(blob:[^">]+)"/g;
                        let match;

                        while(match = regex.exec(editor.html.get())){
                            tempPhotoData.append("photo", match[1]);
                        };

                        // Convert the photo blob to file format.
                        const tempPhotoURL = tempPhotoData.get("photo");
                        const replyData = new FormData();
                        const replyPostID = location.href.split("/").pop().split("?")[0];
                        const replyDramaTitle = $("#discussMainHeader").text().split("：").pop();
                        const replyContent = editor.html.get();

                        fetch(tempPhotoURL)
                        .then((res) => res.blob())
                        .then((myBlob) => {
                            const replyPhoto = new File([myBlob], "image.jpeg", {
                                type: myBlob.type
                            });

                            replyData.append("replyPostID", replyPostID);
                            replyData.append("replyDramaTitle", replyDramaTitle);
                            replyData.append("replyContent", replyContent);
                            replyData.append("replyPhoto", replyPhoto);
                        })
                        .then(() => {
                            fetch("/api/reply", {
                                method: "POST",
                                body: replyData
                            })
                            .then(response => response.json())
                            .then(data => {
                                // User input error handling.
                                if(data.error && data.message == "The input does not match with the designated format"){
                                    alert("請輸入正確回覆內容！");

                                    // Remove loading effect
                                    topbar.hide();
                                };

                                if(data.ok){
                                    // Clear the input area data before redirection.
                                    editor.html.set("");

                                    // Redirect to the latest page if successful.
                                    location.href = location.href.split("=")[0] + "=" + totalPages;

                                    // Remove loading effect
                                    topbar.hide();
                                };
                            })
                            .catch(error => {
                                console.log("Error(discuss.post.js - 1): " + error);

                                // Remove loading effect
                                topbar.hide();
                            });
                        })
                        .catch(error => {
                            console.log("Error(discuss.post.js - 2): " + error);

                            // Remove loading effect
                            topbar.hide();
                        });
                    };
                };
            })
            .catch(error => {
                console.log("Error(discuss.post.js - 3): " + error);
            });

        });

        // Handle cancel reply button.
        $("#discussCancelBtn").click(() => {
            $("#discussReplyContainer").css("display", "none");
            $("#discussCancelBtn").css("display", "none");
            $("#discussReplyBtnWidth").css("flex", "");
            $("#discussReplyBtnWidth").css("width", "");
            $("#discussCancelBtnWidth").css("flex", "");
            $("#discussCancelBtnWidth").css("width", "");
            $("#discussReplyBtn").text("回覆");
            editor.html.set("");
        });

        // Handle quote button click.
        $("#discussReplyQuote").click((e) => {

            // If there is content in the input area, not allowed to click the button again.
            if(editor.html.get().length != 0 || $("#discussReplyBtn").text() == "送出"){
                e.preventDefault();
            }
            else{
                // Add loading effect
                topbar.show();
        
                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };
    
                userAuth("/api/user/auth")
                .then(data => {
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";
    
                        // Remove loading effect
                        topbar.hide();
                    };
    
                    if(data.data){
                        // Display reply button.
                        $("#discussReplyBtn").click();

                        // Copy the post content and display on the reply input area.
                        const postContent = $("#discussContent").html();
                        const postQuote = `<blockquote>${postContent}</blockquote><br/>`;
                        editor.html.set(postQuote);

                        // Scroll the window to the bottom of browser.
                        window.scrollTo(0, document.body.scrollHeight);

                        // Remove loading effect
                        topbar.hide();
                    };
                })
                .catch(error => {
                    console.log("Error(discuss.post.js - 4): " + error);
                });
            };

        });

        // Handle each reply quote button click.
        $("img.discuss-reply-quote-icon").click((e) => {

            // If there is content in the input area, not allowed to click the button again.
            if(editor.html.get().length != 0 || $("#discussReplyBtn").text() == "送出"){
                e.preventDefault();
            }
            else{
                // Add loading effect
                topbar.show();
        
                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };
    
                userAuth("/api/user/auth")
                .then(data => {
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";
    
                        // Remove loading effect
                        topbar.hide();
                    };
    
                    if(data.data){
                        // Display reply button.
                        $("#discussReplyBtn").click();

                        // Copy the post content and display on the reply input area.
                        const replyID = `#replyContent${e.target.attributes.id.value}`;
                        const replyContent = $(replyID).html();
                        const replyQuote = `<blockquote>${replyContent}</blockquote><br/>`;
                        editor.html.set(replyQuote);

                        // Scroll the window to the bottom of browser.
                        window.scrollTo(0, document.body.scrollHeight);

                        // Remove loading effect
                        topbar.hide();
                    };
                })
                .catch(error => {
                    console.log("Error(discuss.post.js - 5): " + error);
                });
            };

        });

        // Handle like "post" button click.

        // check if the user has already liked this post on web initial load.
        const likePostId = $(".discuss-post-like-click").data("likeId");

        if(localStorage.getItem(likePostId) === "liked"){
            $(".discuss-post-like-click").attr("src", "/img/icon_like_after.png");
            $("#likePostCount").css("color", "rgb(2, 177, 247)");
        };

        $(".discuss-post-like-click").click(() => {

            // Add loading effect
            topbar.show();
    
            async function userAuth(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };

            userAuth("/api/user/auth")
            .then(data => {
                if(data.error && data.message == "forbidden"){
                    location.href = "/signin";

                    // Remove loading effect
                    topbar.hide();
                }
                else if(data.data){
                    const likePostID = $(".discuss-post-like-click").attr("id");
                    
                    async function addLikeCount(url, method){
                        const response = await fetch(url, method);
                        const data = await response.json();
                        return data;
                    };

                    addLikeCount("/api/like", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({
                            "likePostID": likePostID
                        })
                    })
                    .then(data => {
                        if(data.data == 0){
                            $("#likePostCount").text("0");
                            localStorage.removeItem(likePostId);
                            $(".discuss-post-like-click").attr("src", "/img/icon_like.png");
                            $("#likePostCount").css("color", "#000");

                            // Remove loading effect
                            topbar.hide();
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

                            // Remove loading effect
                            topbar.hide();
                        };
                    })
                    .catch(error => {
                        console.log("Error(discuss.post.js - 6): " + error);

                        // Remove loading effect
                        topbar.hide();
                    });
                };
            })
            
        });

        // Handle like "reply" button click.
        const likeButtons = document.querySelectorAll(".discuss-reply-like-click");

        likeButtons.forEach(button => {
            const likeReplyId = button.dataset.likeId;

            // check if the user has already liked this post on web initial load.
            if(localStorage.getItem(likeReplyId) === "liked"){
                $(`#${button.attributes.id.value}`).attr("src", "/img/icon_like_after.png");
                $(`#id${button.attributes.id.value}`).css("color", "rgb(2, 177, 247)");
            };

            button.addEventListener("click", () => {

                // Add loading effect
                topbar.show();
        
                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                userAuth("/api/user/auth")
                .then(data => {
                    if(data.error && data.message == "forbidden"){
                        location.href = "/signin";

                        // Remove loading effect
                        topbar.hide();
                    };

                    if(data.data){
                        const likePostID = button.attributes.id.value;
                
                        async function addLikeCount(url, method){
                            const response = await fetch(url, method);
                            const data = await response.json();
                            return data;
                        };
            
                        addLikeCount("/api/like", {
                            method: "POST",
                            headers: {"Content-type": "application/json"},
                            body: JSON.stringify({
                                "likePostID": likePostID
                            })
                        })
                        .then(data => {
                            if(data.data == 0){
                                $(`#id${likePostID}`).text("0");
                                localStorage.removeItem(likeReplyId);
                                $(`#${likePostID}`).attr("src", "/img/icon_like.png");
                                $(`#id${likePostID}`).css("color", "#000");
            
                                // Remove loading effect
                                topbar.hide();
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
            
                                // Remove loading effect
                                topbar.hide();
                            };
                        })
                        .catch(error => {
                            console.log("Error(discuss.post.js - 7): " + error);
            
                            // Remove loading effect
                            topbar.hide();
                        });
                    };
                })

            });
        });
        
    })
    .catch(error => {
        console.log("Error(discuss.post.js - 8): " + error);

        // Remove loading effect.
        topbar.hide();
    });

};