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

// signup and signin pages
router.get("/signin", (req, res) => {
    res.render("signin");
})

// Error page
router.use((req, res) => {
    res.status(404).send("ERROR! 404 NOT FOUND!");
});

module.exports = router;