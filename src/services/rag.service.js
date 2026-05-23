const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const generateRagAnswer = async ({ question, matches }) => {
    if (!matches || matches.length === 0) {
        return "I could not find relevant information in the uploaded document.";
    }

    const context = matches
        .map(
            (match, index) =>
                `[Chunk ${index + 1}]\n${match.text}`
        )
        .join("\n\n");

    const prompt = `
You are a helpful PDF assistant.

Answer the user's question ONLY using the provided context.

If the answer is not present in the context, say:
"I could not find this information in the uploaded document."

Do not make up information.
Do not use external knowledge.

Context:
${context}

Question:
${question}

Answer:
`;

    const result = await chatModel.generateContent(prompt);

    const response = await result.response;

    return response.text();
};

module.exports = {
    generateRagAnswer,
};