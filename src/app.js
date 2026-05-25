const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const healthRoutes = require("./routes/health.routes");
const documentRoutes = require("./routes/document.routes");
const langchainRoutes = require("./routes/langchain.routes");
const langgraphRoutes = require("./routes/langgraph.routes");

const app = express();

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", healthRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/langchain", langchainRoutes);
app.use("/api/langgraph", langgraphRoutes);

// 404 handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global error handler
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size should not exceed 5 MB",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
    });
});

app.listen(PORT, () => { console.log(`Server running in ${env} mode on port ${PORT}`); });