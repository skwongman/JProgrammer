const express = require("express");
const router = express.Router();

// index.html
router.get("/", (req, res) => {
    res.render("index");
});

// drama/id.html
router.get("/drama/:id", (req, res) => {
    res.render("drama");
});

// signin.html
router.get("/signin", (req, res) => {
    res.render("signin");
})

// member.html
router.get("/member", (req, res) => {
    res.render("member");
})

// add.html
router.get("/add", (req, res) => {
    res.render("add");
})

// Error page
router.use((req, res) => {
    res.status(404).send("ERROR! 404 NOT FOUND!");
});

module.exports = router;