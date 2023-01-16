const express = require("express");
const app = express();
const pageRouter = require("./backend/commons/pages");
const dramaAPIRouter = require("./backend/routes/dramaAPI.route");
const bodyParser = require("body-parser");


// Create HTTPS Server
const https = require("https");
const fs = require("fs");
const privateKey = fs.readFileSync("venv/privkey.pem", "utf8");
const certificate = fs.readFileSync("venv/fullchain.pem", "utf8");
const credentials = {key: privateKey, cert: certificate};
const httpsServer = https.createServer(credentials, app);


// Dotenv
require('dotenv').config();


// File Setting
app.set("view engine", "ejs");
app.set("views", "frontend/page");


// Middleware
app.use(express.static("frontend/public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


// API Endpoints
// Index
app.get("/", pageRouter);

// Get drama API
app.get("/api/drama", dramaAPIRouter);

// 404 Error page
app.use(pageRouter);


// Port setting
const port = process.env.PORT || 5000;
httpsServer.listen(port, "0.0.0.0", () => console.log(`App listening on: https://localhost:${port}`));