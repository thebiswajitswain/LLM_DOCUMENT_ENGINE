const fs = require("fs");
const path = require("path");

const vectorStorePath = path.join(process.cwd(), "data", "vector-store.json");

const readVectorStore = () => {
    if (!fs.existsSync(vectorStorePath)) {
        return [];
    }

    const rawData = fs.readFileSync(vectorStorePath, "utf-8");

    if (!rawData.trim()) {
        return [];
    }

    return JSON.parse(rawData);
};

const writeVectorStore = (data) => {
    fs.writeFileSync(vectorStorePath, JSON.stringify(data, null, 2));
};

const saveDocumentVectors = ({
    documentId,
    fileName,
    filePath,
    totalPages,
    textLength,
    chunksWithEmbeddings,
}) => {
    const store = readVectorStore();

    const documentRecord = {
        documentId,
        fileName,
        filePath,
        totalPages,
        textLength,
        totalChunks: chunksWithEmbeddings.length,
        embeddingDimension: chunksWithEmbeddings[0]?.embedding?.length || 0,
        createdAt: new Date().toISOString(),
        chunks: chunksWithEmbeddings.map((chunk) => ({
            id: `${documentId}_chunk_${chunk.chunkIndex}`,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            wordCount: chunk.wordCount,
            embedding: chunk.embedding,
        })),
    };

    store.push(documentRecord);

    writeVectorStore(store);

    return documentRecord;
};

const getAllDocuments = () => {
    const store = readVectorStore();

    return store.map((doc) => ({
        documentId: doc.documentId,
        fileName: doc.fileName,
        filePath: doc.filePath,
        totalPages: doc.totalPages,
        textLength: doc.textLength,
        totalChunks: doc.totalChunks,
        embeddingDimension: doc.embeddingDimension,
        createdAt: doc.createdAt,
    }));
};

const getDocumentById = (documentId) => {
    const store = readVectorStore();

    return store.find((doc) => doc.documentId === documentId);
};

module.exports = {
    saveDocumentVectors,
    getAllDocuments,
    getDocumentById,
};