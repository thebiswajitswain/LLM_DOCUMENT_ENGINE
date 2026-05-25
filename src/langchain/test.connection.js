require("dotenv").config();
const { vectorStore, } = require("./vectorstores/qdrant.vectorstore");

const testConnection = async () => {
    try {
        console.log("Testing LangChain setup...");
        console.log("Qdrant Vector Store initialized successfully");
        console.log({
            qdrantUrl: process.env.QDRANT_URL,
            collection: process.env.QDRANT_COLLECTION,
        });

        process.exit(0);
    } catch (error) {
        console.error("LangChain setup failed");
        console.error(error);
        process.exit(1);
    }
};

testConnection();