const { model, } = require("../../langchain/chains/chat.model");

const directNode = async (state) => {
    console.log("Running Direct Answer Node");
    const prompt = `You are a helpful AI assistant.

Answer the user's question clearly.

Question:
${state.question}`;
    const response = await model.invoke(prompt);
    return { ...state, answer: response.content, };
};

module.exports = {
    directNode,
};