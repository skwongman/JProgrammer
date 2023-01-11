const express = require("express");
const app = express();
const pageRouter = require("./backend/commons/pages");
const bodyParser = require("body-parser");


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


// 404 Error page
app.use(pageRouter);


// Port setting
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => console.log(`App listening on: http://localhost:${port}`));