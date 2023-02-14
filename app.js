const express = require("express");
const app = express();
const pageRouter = require("./backend/commons/pages");
const dramaAPIRouter = require("./backend/routes/dramaAPI.route");
const timetableAPIRouter = require("./backend/routes/timetableAPI.route");
const popularAPIRouter = require("./backend/routes/popularAPI.route");
const searchDramaAPIRouter = require("./backend/routes/searchDramaAPI.route");
const dramaQueryStringAPIRouter = require("./backend/routes/dramaQueryStringAPI.route");
const signupAPIRouter = require("./backend/routes/signupAPI.route");
const signinAPIRouter = require("./backend/routes/signinAPI.route");
const signoutAPIRouter = require("./backend/routes/signoutAPI.route");
const signinStatusAPIRouter = require("./backend/routes/signinStatusAPI.route");
const proxyAPIRouter = require("./backend/routes/proxyAPI.route");
const watchDramaAccessAPIRouter = require("./backend/routes/watchDramaAccessAPI.route");
const latestAPIRouter = require("./backend/routes/latestAPI.route");
const popularListAPIRouter = require("./backend/routes/popularListAPI.route");
const addDramaAPIRouter = require("./backend/routes/addDramaAPI.route");
const videoServerAPIRouter = require("./backend/routes/videoServerAPI.route");
const editDramaAccessAPIRouter = require("./backend/routes/editDramaAccessAPI.route");
const editDramaAPIRouter = require("./backend/routes/editDramaAPI.route");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");


// Create HTTPS Server
const https = require("https");
const fs = require("fs");
const privateKey = fs.readFileSync("venv/privkey.pem", "utf8");
const certificate = fs.readFileSync("venv/fullchain.pem", "utf8");
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);


// Dotenv
require("dotenv").config();


// File Setting
app.set("view engine", "ejs");
app.set("views", "frontend/page");


// Middleware
app.use(express.static("frontend/public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/js", express.static(path.join(__dirname, "node_modules/torrent-stream/client")));


// Index page
app.get("/", pageRouter);


// API Endpoints

// Get drama API
app.get("/api/drama", dramaAPIRouter);
// Get popular drama API
app.get("/api/popular", popularAPIRouter);
// Get timetable API
app.get("/api/timetable", timetableAPIRouter);
// Search drama API
app.get("/api/search", searchDramaAPIRouter);

// Get each drama API
app.get("/api/drama/:id", dramaQueryStringAPIRouter);

// User signup API
app.post("/api/user", signupAPIRouter);
// User signin API
app.put("/api/user/auth", signinAPIRouter);
// User signout API
app.delete("/api/user/auth", signoutAPIRouter);
// User signin Status API
app.get("/api/user/auth", signinStatusAPIRouter);

// Proxy API
app.get("/api/proxy", proxyAPIRouter);
// Watch drama access API
app.get("/api/video/auth", watchDramaAccessAPIRouter);

// Latest Drama List API
app.get("/api/latest", latestAPIRouter);
// Popular Drama List API
app.get("/api/popular/list", popularListAPIRouter);

// Add Drama Information
// Popular Drama List API
app.post("/api/add", addDramaAPIRouter);
// Video Server
app.get("/api/video", videoServerAPIRouter);

// Edit Drama Information
app.get("/api/edit/auth", editDramaAccessAPIRouter);

app.put("/api/edit/:id", editDramaAPIRouter);

// 404 Error page
app.use(pageRouter);


// Port setting
const port = process.env.PORT || 5000;
httpsServer.listen(port, "0.0.0.0", () => console.log(`App listening on: https://localhost:${port}`));