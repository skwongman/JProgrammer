const { client } = require("../../commons/common");
const { generateTime, generateChatTime } = require("../../commons/common");

// Socket.io
const chatSocket = (io) => {

    io.on("connection", (socket) => {

        // console.log("a user connected");

        // Member entered to the chat message window.
        socket.on("join room", (roomID, memberName, receiverName, senderID, receiverID) => {
            socket.join(roomID);
            socket.senderID = senderID;
            socket.receiverID = receiverID;
            socket.memberName = memberName;
            socket.receiverName = receiverName;
            socket.currentRoomID = roomID;

            // console.log(`User ${memberName} joined room ${roomID}`);

            const membersInRoom = Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketId) => {
                return io.sockets.sockets.get(socketId).memberName;
            });

            io.to(roomID).emit("members in room", membersInRoom);
            io.to(roomID).emit("user online", memberName);
        });

        // Send message between members.
        socket.on("chat message", (roomID, msg) => {
            const chatMessageRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,200}$/;

            if(!msg.match(chatMessageRegex)){
                return false;
            }
            else{
                const collection = client.db("website").collection("chat");
                const chatTime = generateChatTime();
                const insertQuery = {
                    chatRoomID: roomID,
                    chatSenderID: socket.senderID,
                    chatReceiverID: socket.receiverID,
                    chatSenderName: socket.memberName,
                    chatReceiverName:socket.receiverName,
                    chatMessage: msg,
                    chatCreatedTime: chatTime
                };
    
                collection.insertOne(insertQuery);
                
                io.to(roomID).emit("chat message", msg, socket.memberName);
            };
        });

        // Member left the chat message window.
        socket.on("disconnect", () => {
            // console.log(`User ${socket.memberName} disconnected`);

            socket.memberLeaveTime = generateTime();

            io.to(socket.currentRoomID).emit("user offline", socket.memberName, socket.memberLeaveTime);

        });

    });

};

module.exports = chatSocket;