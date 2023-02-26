// Commons
const express = require("express");
const app = express();
const { client } = require("./backend/commons/common");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");


// HTML pages
const pageRouter = require("./backend/commons/pages");


// Index page routes
const dramaAPIRouter = require("./backend/routes/index/dramaAPI.route");
const popularAPIRouter = require("./backend/routes/index/popularAPI.route");
const timetableAPIRouter = require("./backend/routes/index/timetableAPI.route");
const searchDramaAPIRouter = require("./backend/routes/index/searchDramaAPI.route");

// Drama page routes
const dramaQueryStringAPIRouter = require("./backend/routes/drama/dramaQueryStringAPI.route");
const proxyAPIRouter = require("./backend/routes/drama/proxyAPI.route");
const videoAuthAPIRouter = require("./backend/routes/drama/videoAuthAPI.route");
const videoServerAPIRouter = require("./backend/routes/drama/videoServerAPI.route");

// Signin page routes
const signupAPIRouter = require("./backend/routes/signin/signupAPI.route");
const signinAPIRouter = require("./backend/routes/signin/signinAPI.route");
const signoutAPIRouter = require("./backend/routes/signin/signoutAPI.route");
const signinStatusAPIRouter = require("./backend/routes/signin/signinStatusAPI.route");

// Add drama page route
const addDramaAPIRouter = require("./backend/routes/add/addDramaAPI.route");

// Edit drama page routes
const editDramaAPIRouter = require("./backend/routes/edit/editDramaAPI.route");

// Discuss page routes
const discussAPIRouter = require("./backend/routes/discuss/discussAPI.route");
const replyAPIRouter = require("./backend/routes/discuss/replyAPI.route");
const discussQueryStringAPIRouter = require("./backend/routes/discuss/discussQueryStringAPI.route");
const discussLikeCountAPIRouter = require("./backend/routes/discuss/discussLikeCountAPI.route");

// Chat message route
const chatHistoryAPIRouter = require("./backend/routes/chat/chatHistoryAPI.route");

// Member page routes
const updateMemberPhotoAPIRouter = require("./backend/routes/member/updateMemberPhotoAPI.route");
const updateMemberPasswordAPIRouter = require("./backend/routes/member/updateMemberPasswordAPI.route");


// Dotenv
require("dotenv").config();


// HTTPS server
const https = require("https");
const fs = require("fs");
const privateKey = fs.readFileSync("venv/privkey.pem", "utf8");
const certificate = fs.readFileSync("venv/fullchain.pem", "utf8");
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);


// Socket.io for chat message
const io = require("socket.io")(httpsServer);
const chatSocket = require("./backend/routes/chat/chat");
chatSocket(io);


// Template engine
app.set("view engine", "ejs");
app.set("views", "frontend/page");


// Middleware
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
app.get("/api/popular", popularAPIRouter);
app.get("/api/timetable", timetableAPIRouter);
app.get("/api/search", searchDramaAPIRouter);

// Drama page routes
app.get("/api/drama/:id", dramaQueryStringAPIRouter);
app.get("/api/proxy", proxyAPIRouter);
app.get("/api/video/auth", videoAuthAPIRouter);
app.get("/api/video", videoServerAPIRouter);

// Signin page routes
app.post("/api/user", signupAPIRouter);
app.put("/api/user/auth", signinAPIRouter);
app.delete("/api/user/auth", signoutAPIRouter);
app.get("/api/user/auth", signinStatusAPIRouter);

// Add drama page route
app.post("/api/add", addDramaAPIRouter);

// Edit drama page routes
app.put("/api/edit/:id", editDramaAPIRouter);

// Discuss page routes
app.post("/api/discuss", discussAPIRouter)
app.post("/api/reply", replyAPIRouter)
app.get("/api/discuss/:id", discussQueryStringAPIRouter);
app.post("/api/like", discussLikeCountAPIRouter);

// Chat message route
app.put("/api/chat/history/:id", chatHistoryAPIRouter);

// Member page routes
app.put("/api/member/photo", updateMemberPhotoAPIRouter);
app.put("/api/member/password", updateMemberPasswordAPIRouter);


// Error page
app.use(pageRouter);


// Port
const port = process.env.PORT || 5000;
httpsServer.listen(port, "0.0.0.0", () => console.log(`App listening on: https://localhost:${port}`));