const { retriever } = require("../langchain/retrievers/pdf.retriever");
const { ragPrompt, } = require("../langchain/prompts/rag.prompt");
const { model, } = require("../langchain/chains/chat.model");
const { buildRagChain, } = require("../langchain/chains/rag.chain");
const { getSessionHistory, addMessageToHistory, } = require("../langchain/memory/chat.memory");

const testRetriever = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        // Retrieve documents using LangChain
        const docs = await retriever.invoke(question);

        return res.status(200).json({
            success: true,
            question,
            totalDocuments: docs.length,
            documents: docs.map((doc, index) => ({
                index,
                contentPreview: doc.pageContent.slice(0, 300),
                metadata: doc.metadata,
            })),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve documents",
            error: error.message,
        });
    }
};

const testChat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        // Build prompt
        const prompt = await ragPrompt.invoke({
            input: question,
        });

        // Generate response
        const response = await model.invoke(prompt);

        return res.status(200).json({
            success: true,
            question,
            answer: response.content,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate chat response",
            error: error.message,
        });
    }
};

const askWithLangChain = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        const chain = buildRagChain();
        const answer = await chain.invoke(question);
        const docs = await retriever.invoke(question);

        return res.status(200).json({
            success: true,
            question,
            answer,
            sources: docs.map((doc, index) => ({
                index,
                contentPreview: doc.pageContent.slice(0, 300),
                metadata: doc.metadata,
            })),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate LangChain RAG response",
            error: error.message,
        });
    }
};

const conversationalChat = async (req, res) => {
    try {
        const { sessionId, question } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required",
            });
        }

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        // Get history
        const history =
            getSessionHistory(sessionId);

        // Convert history to text
        const historyText = history
            .map(
                (msg) =>
                    `${msg.role}: ${msg.content}`
            )
            .join("\n");

        // Build chain
        const chain = buildRagChain();

        // Generate answer
        const answer = await chain.invoke({
            input: question,

            history: historyText,
        });

        // Save user message
        addMessageToHistory({
            sessionId,

            role: "user",

            content: question,
        });

        // Save assistant message
        addMessageToHistory({
            sessionId,
            role: "assistant",
            content: answer,
        });

        return res.status(200).json({
            success: true,
            sessionId,
            question,
            answer,
            totalMessages: getSessionHistory(sessionId).length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate conversational response",
            error: error.message,
        });
    }
};

module.exports = {
    testRetriever,
    testChat,
    askWithLangChain,
    conversationalChat,
};