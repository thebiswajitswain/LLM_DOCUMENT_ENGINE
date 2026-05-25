require("dotenv").config();

const {
    retriever,
} = require("./retrievers/pdf.retriever");

const testRetriever = async () => {
    try {
        console.log("Testing LangChain Retriever...");

        const question =
            "Tell me about my salary & bonus. also breakdown this?";

        console.log("Question:", question);

        const docs = await retriever.invoke(question);

        console.log("\nRetrieved Documents:\n");

        docs.forEach((doc, index) => {
            console.log(`\n--- Document ${index + 1} ---`);

            console.log("Content Preview:");

            console.log(
                doc.pageContent.slice(0, 300)
            );

            console.log("\nMetadata:");

            console.log(doc.metadata);
        });

        process.exit(0);
    } catch (error) {
        console.error("Retriever test failed");

        console.error(error);

        process.exit(1);
    }
};

testRetriever();