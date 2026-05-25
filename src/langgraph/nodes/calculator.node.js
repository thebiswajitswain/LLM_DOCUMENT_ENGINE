const calculatorNode = async (state) => {
    console.log("Running Calculator Node");

    try {
        const expression = state.question
            .replace(/what is/gi, "")
            .trim();

        // Simple calculator
        const result = eval(expression);

        return {
            ...state,

            answer: `The answer is ${result}`,
        };
    } catch (error) {
        return {
            ...state,

            answer:
                "Failed to calculate expression.",
        };
    }
};

module.exports = {
    calculatorNode,
};