const express = require("express");
const router = express.Router();
const chatHistoryAPIModel = require("../../models/chat/chatHistoryAPI.model");
const cache = require("../../commons/redis");

router.put("/api/chat/history/:id", cache, chatHistoryAPIModel);

module.exports = router;