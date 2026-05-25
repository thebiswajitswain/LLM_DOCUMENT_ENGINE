const {
    model,
} = require("../../langchain/chains/chat.model");

const {
    routerPrompt,
} = require("../prompts/router.prompt");

const routerNode = async (state) => {
    console.log("Running AI Router Node");

    const question =
        state.question.toLowerCase();

    // Strong document-specific keywords
    const retrievalKeywords = [
        "salary",
        "notice period",
        "offer letter",
        "tarun",
        "alleshealth",
        "company",
        "joining",
        "employment",
        "boyd",
        "jim",
        "from series",
    ];

    // Hard override for retrieval
    const forceRetrieve =
        retrievalKeywords.some((keyword) =>
            question.includes(keyword)
        );

    // Calculator detection
    const mathPattern =
        /^[0-9+\-*/().%\s]+$/;

    const isMathQuestion =
        question.includes("what is") &&
        /[0-9]/.test(question);

    if (
        mathPattern.test(question) ||
        isMathQuestion
    ) {
        console.log(
            "Forced Route: calculator"
        );

        return {
            ...state,

            retryCount:
                (state.retryCount || 0) + 1,

            route: "calculator",
        };
    }

    // Strong retrieval override
    if (forceRetrieve) {
        console.log(
            "Forced Route: retrieve"
        );

        return {
            ...state,

            retryCount:
                (state.retryCount || 0) + 1,

            route: "retrieve",
        };
    }

    // AI Routing fallback
    const prompt = `
${routerPrompt}

Reasoning:
${state.reasoning}

Question:
${state.question}
`;

    const response =
        await model.invoke(prompt);

    const route = response.content
        .trim()
        .toLowerCase()
        .replace(".", "")
        .replace(",", "")
        .split("\n")[0]
        .trim();

    console.log("RAW ROUTE:", route);

    const validRoutes = [
        "retrieve",
        "calculator",
        "direct",
    ];

    return {
        ...state,

        retryCount:
            (state.retryCount || 0) + 1,

        route: validRoutes.some((r) =>
            route.includes(r)
        )
            ? validRoutes.find((r) =>
                route.includes(r)
            )
            : "direct",
    };
};

module.exports = {
    routerNode,
};