const express = require("express");
const { testRetriever, testChat, askWithLangChain, conversationalChat } = require("../controllers/langchain.controller");
const router = express.Router();

// Test LangChain Retriever
router.post("/test-retriever", testRetriever);
router.post("/test-chat", testChat);
router.post("/ask", askWithLangChain);
router.post("/chat", conversationalChat);
module.exports = router;