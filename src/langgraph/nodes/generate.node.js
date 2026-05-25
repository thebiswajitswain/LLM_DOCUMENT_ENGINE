const {
    model,
} = require("../../langchain/chains/chat.model");

const generateNode = async (state) => {
    console.log("Running Generate Node");

    const prompt = `
You are a helpful AI assistant.

Answer ONLY using the provided context.

Context:
${state.context}

Question:
${state.question}
`;

    const response =
        await model.invoke(prompt);

    return {
        ...state,

        answer: response.content,
    };
};

module.exports = {
    generateNode,
};