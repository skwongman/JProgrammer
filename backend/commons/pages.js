const express = require("express");
const router = express.Router();

// index.html
router.get("/", (req, res) => {
    res.render("index");
});

// drama/id.html
router.get("/drama", (req, res) => {
    res.render("drama");
});

// Error page
router.use((req, res) => {
    res.status(404).send("ERROR! 404 NOT FOUND!");
});

module.exports = router;