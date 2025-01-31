// Commons
const express = require("express");
const app = express();
const { client, authenticateJWT } = require("./backend/commons/common");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");


// HTML pages
const pageRouter = require("./backend/commons/pages");


// Index page routes
const { dramaAPIRouter, popularAPIRouter, timetableAPIRouter, searchDramaAPIRouter } = require("./backend/routes/indexAPI.route");

// Drama page routes
const { dramaQueryStringAPIRouter, videoAuthAPIRouter, proxyAPIRouter, videoServerAPIRouter } = require("./backend/routes/dramaAPI.route");

// Signin page routes
const { signupAPIRouter, signinAPIRouter, signoutAPIRouter, signinStatusAPIRouter, signinOauthAPIRouter, signinOauthCallbackAPIRouter, signinOauthStatusAPIRouter } = require("./backend/routes/signinAPI.route");

// Add drama page route
const addDramaAPIRouter = require("./backend/routes/addAPI.route");

// Edit drama page routes
const editDramaAPIRouter = require("./backend/routes/editAPI.route");

// Discuss page routes
const { discussAPIRouter, replyAPIRouter, discussQueryStringAPIRouter, discussLikeCountAPIRouter } = require("./backend/routes/discussAPI.route");

// Chat message route
const chatHistoryAPIRouter = require("./backend/routes/chatHistoryAPI.route");

// Member page routes
const { updateMemberPhotoAPIRouter, updateMemberPasswordAPIRouter } = require("./backend/routes/updateMemberAPI.route");


// Dotenv
require("dotenv").config();


// HTTP server
const http = require('http');
const httpServer = http.createServer(app);

// Socket.io for chat message
const io = require("socket.io")(httpServer);
const chatSocket = require("./backend/routes/chatSocketIO");
chatSocket(io);


// Template engine
app.set("view engine", "ejs");
app.set("views", "frontend/page");


// Middleware
app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})
app.use(express.static("frontend/public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/js", express.static(path.join(__dirname, "node_modules/torrent-stream/client")));
app.use(function(req, res, next){
    req.db = client.db("website");
    next();
});


// HTML pages
app.get("/", pageRouter);


// API endpoints
// Index page routes
app.get("/api/drama", dramaAPIRouter);
app.get("/api/drama/popular", popularAPIRouter);
app.get("/api/drama/timetable", timetableAPIRouter);
app.get("/api/drama/search", searchDramaAPIRouter);

// Drama page routes
app.get("/api/drama/:id", dramaQueryStringAPIRouter);
app.get("/api/video/proxy", proxyAPIRouter);
app.get("/api/video/auth", videoAuthAPIRouter);
app.get("/api/video", videoServerAPIRouter);

// Signin page routes
app.post("/api/user", signupAPIRouter);
app.put("/api/user/auth", signinAPIRouter);
app.delete("/api/user/auth", signoutAPIRouter);
app.get("/api/user/auth", signinStatusAPIRouter);

// Google login (OAuth 2.0)
app.post("/api/user/oauth/login", signinOauthAPIRouter);
app.get("/api/user/oauth/callback", signinOauthCallbackAPIRouter);
app.get("/api/user/oauth", authenticateJWT, signinOauthStatusAPIRouter);

// Add drama page route
app.post("/api/drama/add", addDramaAPIRouter);

// Edit drama page routes
app.patch("/api/drama/edit/:id", editDramaAPIRouter);

// Discuss page routes
app.post("/api/discuss", discussAPIRouter)
app.post("/api/discuss/reply", replyAPIRouter)
app.get("/api/discuss/:id", discussQueryStringAPIRouter);
app.post("/api/discuss/like", discussLikeCountAPIRouter);

// Chat message route
app.put("/api/discuss/chat/:id", chatHistoryAPIRouter);

// Member page routes
app.put("/api/member/photo", updateMemberPhotoAPIRouter);
app.put("/api/member/password", updateMemberPasswordAPIRouter);


// Error page
app.use(pageRouter);


// Port
const port = process.env.PORT || 5000;
httpServer.listen(port, "0.0.0.0", () => console.log(`App listening on: http://localhost:${port}`));