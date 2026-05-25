const { RunnableSequence, RunnablePassthrough, } = require("@langchain/core/runnables");
const { StringOutputParser, } = require("@langchain/core/output_parsers");
const { retriever, } = require("../retrievers/pdf.retriever");
const { ragPrompt, } = require("../prompts/rag.prompt");
const { model, } = require("./chat.model");

// Format docs into text
const formatDocuments = (docs) => {
    return docs
        .map((doc) => doc.pageContent)
        .join("\n\n");
};

// Build Conversational RAG Chain
const buildRagChain = () => {
    const chain = RunnableSequence.from([
        {
            context: (input) =>
                retriever
                    .invoke(input.input)
                    .then(formatDocuments),

            history: (input) => input.history,

            input: (input) => input.input,
        },

        ragPrompt,

        model,

        new StringOutputParser(),
    ]);

    return chain;
};

module.exports = {
    buildRagChain,
};