const { extractTextFromPdf } = require("../services/pdf.service");
const { splitTextIntoChunks } = require("../services/chunk.service");
const { createEmbedding, createEmbeddingsForChunks, } = require("../services/embedding.service");
const { storeChunksInQdrant, searchSimilarChunks, } = require("../services/qdrant.service");
const { generateRagAnswer } = require("../services/rag.service");

const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }

        const pdfResult = await extractTextFromPdf(req.file.path);

        if (!pdfResult.text || pdfResult.text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "No readable text found in this PDF. Please upload a text-based PDF, not a scanned/image PDF.",
            });
        }

        const chunks = splitTextIntoChunks(pdfResult.text, 300, 50);

        const chunksWithEmbeddings = await createEmbeddingsForChunks(chunks);

        const documentId = `doc_${Date.now()}`;

        const qdrantResult = await storeChunksInQdrant({
            documentId,
            fileName: req.file.originalname,
            filePath: req.file.path,
            chunksWithEmbeddings,
        });

        return res.status(201).json({
            success: true,
            message: "PDF uploaded, embedded, and stored in Qdrant successfully",
            document: {
                documentId,
                fileName: req.file.originalname,
                filePath: req.file.path,
                totalPages: pdfResult.totalPages,
                textLength: pdfResult.text.length,
                totalChunks: chunks.length,
                totalStoredChunks: qdrantResult.totalStoredChunks,
                embeddingDimension: qdrantResult.embeddingDimension,
            },
            chunks: chunksWithEmbeddings.map((chunk) => ({
                chunkIndex: chunk.chunkIndex,
                wordCount: chunk.wordCount,
                preview: chunk.text.slice(0, 200),
                embeddingPreview: chunk.embedding.slice(0, 5),
            })),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to store document embeddings in Qdrant",
            error: error.message,
        });
    }
};

const askDocument = async (req, res) => {
    try {
        const { documentId, question, topK } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: "documentId is required",
            });
        }

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        // Create embedding for question
        const questionEmbedding = await createEmbedding(question);

        // Retrieve similar chunks
        const matches = await searchSimilarChunks({
            documentId,
            questionEmbedding,
            topK: topK || 3,
        });

        // Generate final AI answer
        const answer = await generateRagAnswer({
            question,
            matches,
        });

        return res.status(200).json({
            success: true,
            question,
            answer,
            totalMatches: matches.length,
            sources: matches.map((match) => ({
                score: match.score,
                chunkIndex: match.chunkIndex,
                wordCount: match.wordCount,
            })),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate RAG answer",
            error: error.message,
        });
    }
};

module.exports = {
    uploadPdf,
    askDocument,
};