const { retriever, } = require("../../langchain/retrievers/pdf.retriever");

// Retrieve relevant chunks
const retrieveNode = async (state) => {
    console.log("Running Retrieve Node");
    const docs = await retriever.invoke(state.question);
    const context = docs.map((doc) => doc.pageContent).join("\n\n");
    return { ...state, context, retrievedDocs: docs, };
};

module.exports = {
    retrieveNode,
};