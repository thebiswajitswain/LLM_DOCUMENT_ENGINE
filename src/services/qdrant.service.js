const { QdrantClient } = require("@qdrant/js-client-rest");
const { v4: uuidv4 } = require("uuid");

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || "http://localhost:6333",
});

const COLLECTION_NAME = process.env.QDRANT_COLLECTION || "pdf_chunks";
const VECTOR_SIZE = Number(process.env.QDRANT_VECTOR_SIZE || 3072);

const ensureCollection = async () => {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
        (collection) => collection.name === COLLECTION_NAME
    );

    if (!exists) {
        await qdrant.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: "Cosine",
            },
        });

        console.log(`Qdrant collection created: ${COLLECTION_NAME}`);
    }
};

const storeChunksInQdrant = async ({
    documentId,
    fileName,
    filePath,
    chunksWithEmbeddings,
}) => {
    await ensureCollection();

    const points = chunksWithEmbeddings.map((chunk) => ({
        id: uuidv4(),
        vector: chunk.embedding,
        payload: {
            documentId,
            fileName,
            filePath,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            wordCount: chunk.wordCount,
            createdAt: new Date().toISOString(),
        },
    }));

    await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points,
    });

    return {
        documentId,
        fileName,
        totalStoredChunks: points.length,
        embeddingDimension: chunksWithEmbeddings[0]?.embedding?.length || 0,
    };
};

const searchSimilarChunks = async ({ documentId, questionEmbedding, topK = 3 }) => {
    await ensureCollection();

    const searchResult = await qdrant.search(COLLECTION_NAME, {
        vector: questionEmbedding,
        limit: topK,
        with_payload: true,
        filter: {
            must: [
                {
                    key: "documentId",
                    match: {
                        value: documentId,
                    },
                },
            ],
        },
    });

    return searchResult.map((item) => ({
        id: item.id,
        score: item.score,
        documentId: item.payload.documentId,
        fileName: item.payload.fileName,
        filePath: item.payload.filePath,
        chunkIndex: item.payload.chunkIndex,
        text: item.payload.text,
        wordCount: item.payload.wordCount,
    }));
};

module.exports = {
    ensureCollection,
    storeChunksInQdrant,
    searchSimilarChunks,
};