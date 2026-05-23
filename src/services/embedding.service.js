const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
});

const createEmbedding = async (text) => {
    if (!text || text.trim().length === 0) {
        throw new Error("Text is required to create embedding");
    }

    const result = await embeddingModel.embedContent(text);

    return result.embedding.values;
};

const createEmbeddingsForChunks = async (chunks) => {
    const chunksWithEmbeddings = [];

    for (const chunk of chunks) {
        const embedding = await createEmbedding(chunk.text);

        chunksWithEmbeddings.push({
            ...chunk,
            embedding,
        });
    }

    return chunksWithEmbeddings;
};

module.exports = {
    createEmbedding,
    createEmbeddingsForChunks,
};