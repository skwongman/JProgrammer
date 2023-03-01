import discussChat from "./discuss.chat.js";
import discussReply from "./discuss.reply.js";
import discussPagination from "./discussPagination.js";
import discussLike from "./discuss.like.js";

export default function discussPost(){

    // Global variables.
    let discussPostID = location.href.split("/").pop();
    let totalPages;

    const model = {

        init: function(){
            view.renderAddLoadingEffect();

            // Clear all the input value on web initial load.
            $("#discussReply").val("");

            // Fetching discuss post data on web initial load.
            async function getData(url){
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };

            getData(`/api/discuss/${discussPostID}`)
            .then(data => {
                view.renderDiscussPostData(data);
            })
            .then(() => {
                discussChat();
            })
            .then(() => {
                discussPagination(discussPostID, totalPages);
            })
            .then(() => {
                discussReply(totalPages);
            })
            .then(() => {
                discussLike();
            })
            .catch(error => {
                view.renderDiscussPostDataError(error);
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

        renderDiscussPostData: function(data){
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

                view.renderRemoveLoadingEffect();
            };
        },

        renderDiscussPostDataError: function(error){
            console.log("Error(discuss.post.js - 8): " + error);

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