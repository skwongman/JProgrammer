const express = require("express");
const router = express.Router();
const { client } = require("../../commons/common");

// Middleware function to add the database connection to the request object
router.use(function(req, res, next){
    req.db = client.db("website");
    next();
});

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
            const chatMessageRegex = /^[\u4e00-\u9fa5a-zA-Z0-9\s!"#$%&'()*+,\-./:;=?@[\\\]^_`{|}~，、？！…。；“”‘’「」【】『』（）《》〈〉￥：‘’“”〔〕·！@#￥%……&*（）—+【】{};:\'\"\[\]\\,.<>\/?@]{1,100}$/;

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
    
                function generateChatTime(){
                    const date = new Date();
                    const offset = 8;
                    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                    const nd = new Date(utc + (3600000 * offset));
                    const chatTime = new Date(nd.getTime() + (3600000 * offset));
                    return chatTime;
                };
            };
        });

        // Member left the chat message window.
        socket.on("disconnect", () => {
            // console.log(`User ${socket.memberName} disconnected`);

            socket.memberLeaveTime = generateLeaveTime();

            io.to(socket.currentRoomID).emit("user offline", socket.memberName, socket.memberLeaveTime);

            function generateLeaveTime(){
                const date = new Date();
                const offset = 8;
                const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
                const nd = new Date(utc + (3600000 * offset));
                const hkTime = new Date(nd.getTime() + (3600000 * offset));
                const hkTimeString = hkTime.toISOString().replace(/T/, " ").replace(/Z$/, "+08:00");
                const leaveTime = hkTimeString.split(" ")[0] + ", " + hkTimeString.split(" ")[1].slice(0, 5);
                return leaveTime;
            };
        });

    });

};

module.exports = chatSocket;