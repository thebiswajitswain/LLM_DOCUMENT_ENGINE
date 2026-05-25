const { model, } = require("../../langchain/chains/chat.model");

const plannerNode = async (state) => {
    console.log("Running Planner Node");

    const prompt = `
You are an AI planning agent.

Create a short execution plan
for answering the user's question.

Break the solution into steps.

Keep it concise.

Question:
${state.question}
`;

    const response =
        await model.invoke(prompt);

    // Convert plan into array
    const plan = response.content
        .split("\n")
        .filter((step) => step.trim());

    return {
        ...state,

        plan,
    };
};

module.exports = {
    plannerNode,
};