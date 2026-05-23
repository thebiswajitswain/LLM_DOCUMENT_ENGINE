const express = require("express");
const upload = require("../middlewares/upload.middleware");
const { uploadPdf, askDocument } = require("../controllers/document.controller");

const router = express.Router();

router.post("/upload", upload.single("file"), uploadPdf);
router.post("/ask", askDocument);

module.exports = router;