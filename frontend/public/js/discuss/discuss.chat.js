export default function discussChat(){
    
    // Global variables.
    let socket = io();
    let roomID;
    let memberDisplayName;
    let receiverNames;
    let receiverName;
    let memberProfilePicture;
    let receiverProfoliePicture;
    
    // Handle chat message window click.
    $("img.discuss-title-user-profile-picture").click((e) => {

        // Add loading effect
        topbar.show();

        // Disconnect any existing socket connections
        socket.disconnect();
        socket = io();

        // Check user signin status.
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

                receiverNames = e.target.attributes.chat.value;
                const postID = e.target.attributes.post.value;
                receiverName = $(`#replyMemberName.c${postID}${receiverNames}`).text();
                receiverProfoliePicture = e.target.attributes.src.value;
                const senderName = data.data.memberName;
                memberDisplayName = data.data.memberName;
                const senderID = data.data.memberID;
                const receiverID = e.target.attributes.chat.value;
                const senderChatID = data.data.memberID.slice(-6);
                const receiverChatID = e.target.attributes.chat.value.slice(-6);
                roomID = senderChatID + "-" + receiverChatID;
                roomID = roomID.split("-").sort().join("-");
                memberProfilePicture = data.data.memberProfilePicture;
    
                // Self-chat message function is not allowed.
                if(receiverNames == senderID){
                    e.preventDefault();
                    e.stopPropagation();

                    // Remove loading effect
                    topbar.hide();

                    return false;
                }
                else{
                    // Chat message window HTML DOM.
                    $("#chatOuterContainer").empty();
        
                    $("#chatOuterContainer").append(`
                        <div id="chatContainer" class="chat-container">
                        <div id="onlineStatus" class="online-status"></div>
                            <div id="chatArea" class="chat-area"></div>
                            <div class="chat-input-send-container">
                                <input id="chatInput" class="chat-input" type="text">
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
                            $("#chatOuterContainer").empty();
                        });
                        
                        function generateToday(){
                            const date = new Date();
                            const offset = 8;
                            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                            const nd = new Date(utc + (3600000 * offset));
                            const hkTime = new Date(nd.getTime() + (3600000 * offset));
                            const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                            const today = hkTimeString.split(" ")[0];
                            return today;
                        };
                    };
    
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
                            $("#chatOuterContainer").empty();
                        });
                    });
                    
                    // fetch chat history after member profile photo click.
                    async function getData(url, method){
                        const response = await fetch(url, method);
                        const data = await response.json();
                        return data;
                    };

                    getData(`/api/chat/history/${roomID}`, {
                        method: "PUT"
                    })
                    .then(data => {
        
                        if(data.error && data.message == "forbidden"){
                            location.href = "/signin";
            
                            // Remove loading effect
                            topbar.hide();
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
                                    
                                    function generateToday(){
                                        const date = new Date();
                                        const offset = 8;
                                        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                                        const nd = new Date(utc + (3600000 * offset));
                                        const hkTime = new Date(nd.getTime() + (3600000 * offset));
                                        const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                                        const today = hkTimeString.split(" ")[0];
                                        return today;
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

                            // Remove loading effect
                            topbar.hide();
                        };
                    })
                    .catch(error => {
                        console.log("Error(discuss.chat.js): " + error);

                        // Remove loading effect
                        topbar.hide();
                    });
        
                    // Send the chat message to the backend socket.io.
                    socket.emit("join room", roomID, senderName, receiverName, senderID, receiverID);
                    $("#chatContainer").show();
                    return false;
                };

            };

        })
        .then(() => {
            callback();
        })
        .catch(error => {
            console.log("Error(discuss.chat.js): " + error);
        });
    });
    
    // Callback function.
    function callback(){

        // Handle send chat message button click.
        $(`#chatSendBtn`).click(() => {
            const msg = $(`#chatInput`).val();

            socket.emit("chat message", roomID, msg);
            $(`#chatInput`).val("");
            return false;
        });
        
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

        function generateChatTime(){
            const date = new Date();
            const offset = 8;
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const nd = new Date(utc + (3600000 * offset));
            const hkTime = new Date(nd.getTime() + (3600000 * offset));
            const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
            const chatTime = hkTimeString.split(" ").pop().slice(0, 5);
            return chatTime;
        };
    
        // Handle the "user offline" event
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
                    $("#chatOuterContainer").empty();
                });

                function generateToday(){
                    const date = new Date();
                    const offset = 8;
                    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                    const nd = new Date(utc + (3600000 * offset));
                    const hkTime = new Date(nd.getTime() + (3600000 * offset));
                    const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                    const today = hkTimeString.split(" ")[0];
                    return today;
                };
            };
        });

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

};