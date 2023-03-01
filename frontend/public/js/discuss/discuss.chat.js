import { generateChatTime, generateToday } from "../../js/lib/generateTime.js";

export default function discussChat(){

    // Global variables.
    let socket = io();
    let roomID;
    let memberDisplayName;
    let receiverNames;
    let receiverName;
    let memberProfilePicture;
    let receiverProfoliePicture;

    const model = {

        init: function(){
            
            // Handle chat message window click.
            $("img.discuss-title-user-profile-picture").click((event) => {

                // Disconnect any existing socket connections.
                function disconnectAllExistingConnection(){
                    socket.disconnect();
                    socket = io();
                };
                disconnectAllExistingConnection();

                view.renderAddLoadingEffect();

                // Check user signin status.
                async function userAuth(url){
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                };

                userAuth("/api/user/auth")
                .then(data => {
                    view.renderChatUserAuth(data, event);
                })
                .then(() => {
                    handleSendChatMessageBtnClick();
                })
                .then(() => {
                    chatMessageSocketIO();
                })
                .then(() => {
                    memberOffline();
                })
                .then(() => {
                    otherChatSetting();
                })
                .catch(error => {
                    view.renderChatUserAuthError(error);
                });
            });

            // Handle send chat message button click.
            function handleSendChatMessageBtnClick(){
                $(`#chatSendBtn`).click(() => {
                    const msg = $(`#chatInput`).text();

                    socket.emit("chat message", roomID, msg);
                    $(`#chatInput`).text("");
                    return false;
                });
            };

            // Chat meesage socket.io
            function chatMessageSocketIO(){
                socket.on("chat message", function(msg, memberName){

                    // Use regex to check the user input.
                    const chatMessageRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;

                    if(!chatMessageRegex.test(msg)){
                        return false;
                    }
                    else{
                        // If the sender name is same as the member name, then use member's profolie picture.
                        if(memberName == memberDisplayName){
                            // If "today" has already been displayed in the previous chat message, then no need to do HTML DOM for "today".
                            if($("#chatMessageDateToday").text() == "今天"){
                                $(`#chatArea`).append(`
                                    <div class="chat-sender-container">
                                        <div class="chat-sender-container-left"></div>
                                        <div class="chat-sender-container-right">
                                            <img class="chat-sender-profile-picture" src="${memberProfilePicture}">
                                            <div class="chat-sender-message">${msg}</div>
                                            <div class="chat-sender-time">
                                                <div>${generateChatTime()}</div>
                                            </div>
                                        </div>
                                    </div>
                                `);
                            }
                            // Otherwise, do HTML DOM for "today" (i.e. the first chat message today).
                            else{
                                $(`#chatArea`).append(`<div id="chatMessageDateToday" class="chat-message-date today mx-auto">今天</div>`);
                                
                                $(`#chatArea`).append(`
                                    <div class="chat-sender-container">
                                        <div class="chat-sender-container-left"></div>
                                        <div class="chat-sender-container-right">
                                            <img class="chat-sender-profile-picture" src="${memberProfilePicture}">
                                            <div class="chat-sender-message">${msg}</div>
                                            <div class="chat-sender-time">
                                                <div>${generateChatTime()}</div>
                                            </div>
                                        </div>
                                    </div>
                                `);
                            };
                        }
                        // Otherwise, use receiver's profolie picture.
                        else{
                            // If "today" has already been displayed in the previous chat message, then no need to do HTML DOM for "today".
                            if($("#chatMessageDateToday").text() == "今天"){
                                $(`#chatArea`).append(`
                                    <div class="chat-receiver-container">
                                        <div class="chat-receiver-container-left">
                                            <img class="chat-receiver-profile-picture" src="${receiverProfoliePicture}">
                                            <div class="chat-receiver-message">${msg}</div>
                                            <div class="chat-receiver-time">
                                                <div>${generateChatTime()}</div>
                                            </div>
                                        </div>
                                        <div class="chat-receiver-container-right"></div>
                                    </div>
                                `);
                            }
                            // Otherwise, do HTML DOM for "today" (i.e. the first chat message today).
                            else{
                                $(`#chatArea`).append(`<div id="chatMessageDateToday" class="chat-message-date today mx-auto">今天</div>`);

                                $(`#chatArea`).append(`
                                    <div class="chat-receiver-container">
                                        <div class="chat-receiver-container-left">
                                            <img class="chat-receiver-profile-picture" src="${receiverProfoliePicture}">
                                            <div class="chat-receiver-message">${msg}</div>
                                            <div class="chat-receiver-time">
                                                <div>${generateChatTime()}</div>
                                            </div>
                                        </div>
                                        <div class="chat-receiver-container-right"></div>
                                    </div>
                                `);
                            };
                        };
                    };
                });
            };

            // Handle the "user offline" event
            function memberOffline(){
                socket.on("user offline", function(senderName, memberLeaveTime){
                    if(senderName !== memberDisplayName){
                        // Use local storage to save member's leave time / last online time.
                        localStorage.setItem(receiverNames, memberLeaveTime);

                        // If the leave time is today, then display today instead of date.
                        if(memberLeaveTime.split(", ")[0] == generateToday()){
                            // console.log(`User ${senderName} is offline at ${memberLeaveTime}`);
                        
                            $(`#onlineStatus`).empty();

                            $(`#onlineStatus`).append(`
                                <div class="chat-receiver-name-container">
                                    <div class="chat-receiver-name">${senderName}</div>
                                    <div class="chat-receiver-online-status last-online-today">最後上線時間: 今天 ${memberLeaveTime.split(", ").pop().slice(0, 5)}</div>
                                </div>
                                <div class="chat-close-btn-container">
                                    <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                                </div>
                            `);
                        }
                        // Otherwise, display the date and time directly.
                        else{
                            // console.log(`User ${senderName} is offline at ${memberLeaveTime}`);
                            $(`#onlineStatus`).empty();

                            $(`#onlineStatus`).append(`
                                <div class="chat-receiver-name-container">
                                    <div class="chat-receiver-name">${senderName}</div>
                                    <div class="chat-receiver-online-status last-online">最後上線時間: ${memberLeaveTime}</div>
                                </div>
                                <div class="chat-close-btn-container">
                                    <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                                </div>
                            `);
                        };

                        // Handle close chat button click.
                        $("#chatCloseBtn").click(() => {
                            // Disconnect any existing socket connections
                            socket.disconnect();
                            socket = io();
                            $("body").css("overflow", "auto");
                            $("#chatOuterContainer").empty();
                        });
                    };
                });
            };

            function otherChatSetting(){
                // Scrollable chat area
                $(document).ready(function(){
                    // scroll to the bottom of the div
                    var div = document.getElementById(`chatArea`);
                    div.scrollTop = div.scrollHeight;

                    // whenever new content is added, scroll to the bottom again
                    $(`#chatArea`).bind("DOMSubtreeModified", function(){
                        div.scrollTop = div.scrollHeight;
                    });
                });

                // Allow alternative keyboard to hit "Enter" to send out the message.
                $(document).ready(function(){
                    $("#chatInput").keydown(function(event){
                        if(event.key === "Enter"){
                            event.preventDefault();
                            $("#chatSendBtn").click();
                        };
                    });
                });
            };

        }

    };

    const view = {

        renderAddLoadingEffect: function(){
            topbar.show();
        },

        renderRemoveLoadingEffect: function(){
            topbar.hide();
        },

        renderChatUserAuth: function(data, event){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();

                return;
            };

            if(data.data){
                // Various variable declarations.
                receiverNames = event.target.attributes.chat.value;
                const postID = event.target.attributes.post.value;
                receiverName = $(`#replyMemberName.c${postID}${receiverNames}`).text();
                receiverProfoliePicture = event.target.attributes.src.value;
                const senderName = data.data.memberName;
                memberDisplayName = data.data.memberName;
                const senderID = data.data.memberID;
                const receiverID = event.target.attributes.chat.value;
                const senderChatID = data.data.memberID.slice(-6);
                const receiverChatID = event.target.attributes.chat.value.slice(-6);
                roomID = senderChatID + "-" + receiverChatID;
                roomID = roomID.split("-").sort().join("-");
                memberProfilePicture = data.data.memberProfilePicture;
    
                // Self-chat message function is not allowed.
                if(receiverNames == senderID){
                    event.preventDefault();
                    event.stopPropagation();

                    view.renderRemoveLoadingEffect();

                    return;
                };

                // Show the chat message window.
                function chatMessageWindowHTMLDOM(){
                    // Disable the browser scolling bar function.
                    $("body").css("overflow", "hidden");

                    // Chat message window HTML DOM.
                    $("#chatOuterContainer").empty();
        
                    $("#chatOuterContainer").append(`
                        <div id="chatContainer" class="chat-container">
                        <div id="onlineStatus" class="online-status"></div>
                            <div id="chatArea" class="chat-area"></div>
                            <div class="chat-input-send-container">
                                <div id="chatInput" class="chat-input" contenteditable="true"></div>
                                <div id="chatSendBtn" class="chat-send-btn d-flex justify-content-center align-items-center">發送</div>
                            </div>
                        </div>
                    `);
            
                    // Check from the local storage whether last online time is available from the member.
                    if(localStorage.getItem(receiverNames) == null){
                        $(`#onlineStatus`).empty();

                        $(`#onlineStatus`).append(`
                            <div class="chat-receiver-name-container">
                                <div class="chat-receiver-name">${receiverName}</div>
                                <div class="chat-receiver-online-status last-offline">離線</div>
                            </div>
                            <div class="chat-close-btn-container">
                                <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                            </div>
                        `);
                    }
                    else{
                        // Check whether the date is today. If yes, show today instead of today's date.
                        if(localStorage.getItem(receiverNames).split(", ")[0] == generateToday()){
                            $(`#onlineStatus`).empty();

                            $(`#onlineStatus`).append(`
                                <div class="chat-receiver-name-container">
                                    <div class="chat-receiver-name">${receiverName}</div>
                                    <div class="chat-receiver-online-status last-online-today">最後上線時間: 今天 ${localStorage.getItem(receiverNames).split(", ").pop()}</div>
                                </div>
                                <div class="chat-close-btn-container">
                                    <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                                </div>
                            `);
                        }
                        // If not today, show the date directly.
                        else{
                            $(`#onlineStatus`).empty();

                            $(`#onlineStatus`).append(`
                                <div class="chat-receiver-name-container">
                                    <div class="chat-receiver-name">${receiverName}</div>
                                    <div class="chat-receiver-online-status last-online">最後上線時間: ${localStorage.getItem(receiverNames)}</div>
                                </div>
                                <div class="chat-close-btn-container">
                                    <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                                </div>
                            `);
                        };

                        // Handle close chat button click.
                        $("#chatCloseBtn").click(() => {
                            // Disconnect any existing socket connections
                            socket.disconnect();
                            socket = io();
                            $("body").css("overflow", "auto");
                            $("#chatOuterContainer").empty();
                        });
                        
                    };
                };
                chatMessageWindowHTMLDOM();

                // Start chat connection.
                function chatConnection(){
                    // If member entered to the room, showing that he is online.
                    socket.on("members in room", (members) => {
                        // $(`#chatArea`).empty();
                        for(const member of members){
                            if(member !== memberDisplayName){
                                $(`#onlineStatus`).empty();

                                $(`#onlineStatus`).append(`
                                    <div class="chat-receiver-name-container">
                                        <div class="chat-receiver-name">${member}</div>
                                        <div class="chat-receiver-online-status online">在線上</div>
                                    </div>
                                    <div class="chat-close-btn-container">
                                        <img id="chatCloseBtn" class="chat-close-btn" src="/img/icon_delete.png">
                                    </div>
                                `);
                            };
                        };

                        // Handle close chat button click.
                        $("#chatCloseBtn").click(() => {
                            // Disconnect any existing socket connections
                            socket.disconnect();
                            socket = io();
                            $("body").css("overflow", "auto");
                            $("#chatOuterContainer").empty();
                        });
                    });
                };
                chatConnection();

                // fetch chat history after member profile photo click.
                function chatHistory(){
                    async function getData(url, method){
                        const response = await fetch(url, method);
                        const data = await response.json();
                        return data;
                    };

                    getData(`/api/chat/history/${roomID}`, {
                        method: "PUT"
                    })
                    .then(data => {
                        view.renderChatHistoryData(data);
                    })
                    .catch(error => {
                        view.renderChatHistoryDataError(error);
                    });
                };
                chatHistory();

                // Send the chat message to the backend socket.io.
                function emitChatMessageToBackend(){
                    socket.emit("join room", roomID, senderName, receiverName, senderID, receiverID);
                    $("#chatContainer").show();
                    return false;
                };
                emitChatMessageToBackend();
            };
        },

        renderChatUserAuthError: function(error){
            console.log("Error(discuss.chat.js - 1): " + error);

            view.renderRemoveLoadingEffect();
        },

        renderChatHistoryData: function(data){
            if(data.error && data.message == "forbidden"){
                location.href = "/signin";

                view.renderRemoveLoadingEffect();
            }
            else if(data.error && data.message == "ID not found"){
                view.renderRemoveLoadingEffect();

                return null;
            }
            else if(data.data){

                // fetching API in the format of date --> chat message --> date --> chat message.
                const sortedData = data.data.sort((a, b) => a._id.localeCompare(b._id));

                const formattedData = sortedData.flatMap((group) => {
                    return [
                        { type: "date", value: group._id },
                        ...group.chats.map((chat) => ({ type: "chat", value: chat })),
                    ];
                });

                formattedData.map((item) => {
                    if(item.type === "date"){
                        const chatMessageDate = `${item.value}`;

                        // If the chat message date is today, then show today directly.
                        if(chatMessageDate == generateToday()){
                            $(`#chatArea`).append(`<div id="chatMessageDateToday" class="chat-message-date today mx-auto">今天</div>`);
                        }
                        // If not, show the chat date.
                        else{
                            $(`#chatArea`).append(`<div class="chat-message-date mx-auto">${chatMessageDate}</div>`);
                        };
                        
                    }
                    else if(item.type === "chat"){
                        // If the chat sender name is same as the member's name, then show the message on the right hand side.
                        if(item.value.chatSenderID[0].memberName == memberDisplayName){
                            $(`#chatArea`).append(`
                                <div class="chat-sender-container">
                                    <div class="chat-sender-container-left"></div>
                                    <div class="chat-sender-container-right">
                                        <img class="chat-sender-profile-picture" src="${item.value.chatSenderID[0].memberProfilePicture}">
                                        <div class="chat-sender-message">${item.value.chatMessage}</div>
                                        <div class="chat-sender-time">
                                            <div>${item.value.chatCreatedTime.split("T").pop().slice(0, 5)}</div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }
                        else{
                            // Otherwise, show the message on the left hand side.
                            $(`#chatArea`).append(`
                                <div class="chat-receiver-container">
                                    <div class="chat-receiver-container-left">
                                        <img class="chat-receiver-profile-picture" src="${item.value.chatSenderID[0].memberProfilePicture}">
                                        <div class="chat-receiver-message">${item.value.chatMessage}</div>
                                        <div class="chat-receiver-time">
                                            <div>${item.value.chatCreatedTime.split("T").pop().slice(0, 5)}</div>
                                        </div>
                                    </div>
                                    <div class="chat-receiver-container-right"></div>
                                </div>
                            `);
                        };
                    };
                })
                .join("");

                view.renderRemoveLoadingEffect();
            };
        },

        renderChatHistoryDataError: function(error){
            console.log("Error(discuss.chat.js - 2): " + error);

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