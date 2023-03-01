export default function discussReply(totalPages){

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

    const model = {

        init: function(){

            // Handle discuss reply button click.
            function discussReplyBtnClickFunc(){
                // If the no. of pages is reached to 11, reply post function will be disabled.
                if(totalPages >= "11"){
                    $("#discussReplyBtn").css("display", "none");
                }
                else{
                    $("#discussReplyBtn").css("display", "block");
                };

                $("#discussReplyBtn").click(() => {

                    $(".fr-second-toolbar").remove();

                    view.renderAddLoadingEffect();

                    async function userAuth(url){
                        const response = await fetch(url);
                        const data = await response.json();
                        return data;
                    };

                    userAuth("/api/user/auth")
                    .then(data => {
                        view.renderUserAuth(data);
                    })
                    .catch(error => {
                        view.renderUserAuthError(error);
                    });

                });
            };
            discussReplyBtnClickFunc();

            // Handle cancel reply button.
            function cancelReplyBtnClickFunc(){
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
            };
            cancelReplyBtnClickFunc();

            // Handle quote post button click.
            function postQuoteBtnClickFunc(){
                $("#discussReplyQuote").click((e) => {

                    // If there is content in the input area, not allowed to click the button again.
                    if(editor.html.get().replace('<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>', '').length != 0 || $("#discussReplyBtn").text() == "送出"){
                        e.preventDefault();
                    }
                    else{
                        view.renderAddLoadingEffect();
                
                        async function userAuth(url){
                            const response = await fetch(url);
                            const data = await response.json();
                            return data;
                        };

                        userAuth("/api/user/auth")
                        .then(data => {
                            view.renderPostQuoteData(data);
                        })
                        .catch(error => {
                            view.renderPostQuoteDataError(error);
                        });
                    };

                });
            };
            postQuoteBtnClickFunc();

            // Handle quote reply quote button click.
            function replyQuoteBtnClickFunc(){
                $("img.discuss-reply-quote-icon").click((event) => {

                    $(".fr-second-toolbar").remove();

                    // If there is content in the input area, not allowed to click the button again.
                    if(editor.html.get().replace('<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>', '').length != 0 || $("#discussReplyBtn").text() == "送出"){
                        event.preventDefault();
                    }
                    else if(editor.html.get().length == 0 || $("#discussReplyBtn").text() != "送出"){
                        view.renderAddLoadingEffect();
                
                        async function userAuth(url){
                            const response = await fetch(url);
                            const data = await response.json();
                            return data;
                        };

                        userAuth("/api/user/auth")
                        .then(data => {
                            view.renderReplyQuoteData(data, event);
                        })
                        .catch(error => {
                            view.renderReplyQuoteDataError(error);
                        });
                    };
                });
            };
            replyQuoteBtnClickFunc();

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderUserAuth: function(data){
            if(data.error && data.message == "forbidden" || totalPages >= "11"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
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

                    view.renderRemoveLoadingEffect();
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
                        async function replyPostData(url, method){
                            const response = await fetch(url, method);
                            const data = await response.json();
                            return data;
                        };

                        replyPostData("/api/reply", {
                            method: "POST",
                            body: replyData
                        })
                        .then(data => {
                            view.renderReplyData(data);
                        })
                        .catch(error => {
                            view.renderReplyDataError(error);
                        });
                    });
                };
            };
        },

        renderUserAuthError: function(error){
            console.log("Error(discuss.reply.js - 1): " + error);
        },

        renderReplyData: function(data){
            // User input error handling.
            if(data.error && data.message == "The user input do not match with the designated format"){
                alert("請輸入正確回覆內容！");

                view.renderRemoveLoadingEffect();
            };

            if(data.ok){
                // Clear the input area data before redirection.
                editor.html.set("");

                // Redirect to the latest page if successful.
                location.href = location.href.split("=")[0] + "=" + totalPages;

                view.renderRemoveLoadingEffect();
            };
        },

        renderReplyDataError: function(error){
            console.log("Error(discuss.reply.js - 2): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderPostQuoteData: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
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

                view.renderRemoveLoadingEffect();
            };
        },

        renderPostQuoteDataError: function(error){
            console.log("Error(discuss.reply.js - 3): " + error);
        },

        renderReplyQuoteData: function(data, event){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            };

            if(data.data){
                // Display reply button.
                $("#discussReplyBtn").click();

                // Copy the post content and display on the reply input area.
                const replyID = `#replyContent${event.target.attributes.id.value}`;
                const replyContent = $(replyID).html();
                const replyQuote = `<blockquote>${replyContent}</blockquote><br/>`;
                editor.html.set(replyQuote);

                // Scroll the window to the bottom of browser.
                window.scrollTo(0, document.body.scrollHeight);

                view.renderRemoveLoadingEffect();
            };
        },

        renderReplyQuoteDataError: function(error){
            console.log("Error(discuss.reply.js - 4): " + error);
        }

    };

    const controller = {

        init: function(){
            model.init();
        }

    };
    controller.init();

};