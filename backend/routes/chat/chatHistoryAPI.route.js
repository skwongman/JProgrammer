const express = require("express");
const router = express.Router();
const chatHistoryAPIModel = require("../../models/chat/chatHistoryAPI.model");

router.put("/api/chat/history/:id", chatHistoryAPIModel);

module.exports = router;