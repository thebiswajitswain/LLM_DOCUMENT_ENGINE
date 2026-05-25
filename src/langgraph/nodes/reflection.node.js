const { model, } = require("../../langchain/chains/chat.model");

const reflectionNode = async (state) => {
    console.log("Running Reflection Node");

    const prompt = `
You are an AI reflection agent.

Evaluate the quality of the answer.

Question:
${state.question}

Answer:
${state.answer}

Check:
1. Is the answer relevant?
2. Is the answer complete?
3. Is the answer grounded properly?

ONLY respond with:
good
or
bad
`;

    const response =
        await model.invoke(prompt);

    const reflection = response.content
        .trim()
        .toLowerCase();

    console.log(
        "Reflection Result:",
        reflection
    );

    return {
        ...state,

        reflection,
    };
};

module.exports = {
    reflectionNode,
};