const express = require("express");
const router = express.Router();
const dramaQueryStringAPIModel = require("../../models/drama/dramaQueryStringAPI.model");

router.get("/api/drama/:id", dramaQueryStringAPIModel);

module.exports = router;