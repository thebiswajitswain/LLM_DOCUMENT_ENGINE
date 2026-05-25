const { vectorStore, } = require("../vectorstores/qdrant.vectorstore");

// Create retriever from vector store
const retriever = vectorStore.asRetriever({
    k: 3, // top 3 matching chunks
});

module.exports = {
    retriever,
};