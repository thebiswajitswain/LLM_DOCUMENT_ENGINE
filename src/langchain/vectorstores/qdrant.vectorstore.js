const { QdrantClient } = require("@qdrant/js-client-rest");
const { QdrantVectorStore, } = require("@langchain/qdrant");
const { GoogleGenerativeAIEmbeddings, } = require("@langchain/google-genai");

// Qdrant client
const client = new QdrantClient({
    url: process.env.QDRANT_URL,
});

// Gemini Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
});

// LangChain Qdrant Vector Store
const vectorStore = new QdrantVectorStore(embeddings, {
    client,
    collectionName: process.env.QDRANT_COLLECTION,
    // IMPORTANT
    contentPayloadKey: "text",
    metadataPayloadKey: "metadata",
});

module.exports = {
    client,
    embeddings,
    vectorStore,
};