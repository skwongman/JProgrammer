const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.use((req, res) => {
    res.status(404).send("ERROR! 404 NOT FOUND!");
});

module.exports = router;