const { buildRagGraph, } = require("../langgraph/graphs/rag.graph");

const graphChat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "question is required",
            });
        }

        // Build graph
        const graph = buildRagGraph();

        // Run graph
        const result = await graph.invoke({ question, });

        return res.status(200).json({
            success: true,
            question,
            answer: result.answer,
            reasoning: result.reasoning,
            reflection: result.reflection,
            retryCount: result.retryCount,
            plan: result.plan,
            sources: result.retrievedDocs?.map((doc, index) => ({
                index,
                contentPreview: doc.pageContent.slice(0, 300),
                metadata: doc.metadata,
            })) || [],
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to execute LangGraph workflow",
            error: error.message,
        });
    }
};

module.exports = {
    graphChat,
};