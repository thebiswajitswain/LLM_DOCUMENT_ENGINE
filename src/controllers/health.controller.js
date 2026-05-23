const healthCheck = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "PDF RAG Chat API is running",
    });
};

module.exports = {
    healthCheck,
};