const {
  model,
} = require("../../langchain/chains/chat.model");

const reasoningNode = async (state) => {
  console.log("Running Reasoning Node");

  const prompt = `
You are an AI reasoning engine.

Analyze the user's question and explain:

1. What the user is asking
2. Whether external document retrieval may be needed
3. Whether calculation may be needed

Keep reasoning concise.

Question:
${state.question}
`;

  const response =
    await model.invoke(prompt);

  return {
    ...state,

    reasoning: response.content,
  };
};

module.exports = {
  reasoningNode,
};