const express = require("express");
const { graphChat, } = require("../controllers/langgraph.controller");
const router = express.Router();

router.post("/chat", graphChat);
module.exports = router;