const { StateGraph, START, END } = require("@langchain/langgraph");

const { retrieveNode } = require("../nodes/retrieve.node");
const { generateNode } = require("../nodes/generate.node");
const { routerNode } = require("../nodes/router.node");
const { directNode } = require("../nodes/direct.node");
const { reasoningNode } = require("../nodes/reasoning.node");
const { reflectionNode } = require("../nodes/reflection.node");
const { calculatorNode } = require("../nodes/calculator.node");
const { plannerNode } = require("../nodes/planner.node");

// Graph State
const GraphState = {
    question: null,
    context: null,
    answer: null,
    retrievedDocs: [],
    route: null,
    reasoning: null,
    reflection: null,
    retryCount: 0,
    plan: [],
};

// Build Graph
const buildRagGraph = () => {
    const graph = new StateGraph({
        channels: GraphState,
    });

    // Nodes
    graph.addNode("reasoning_agent", reasoningNode);
    graph.addNode("router", routerNode);
    graph.addNode("retrieve", retrieveNode);
    graph.addNode("generate", generateNode);
    graph.addNode("direct", directNode);
    graph.addNode("calculator", calculatorNode);
    graph.addNode("reflection_agent", reflectionNode);
    graph.addNode("planner_agent", plannerNode);

    // Start Flow
    graph.addEdge(START, "planner_agent");
    graph.addEdge("planner_agent", "reasoning_agent");

    // Conditional Routing
    graph.addConditionalEdges(
        "router",
        (state) => state.route,
        {
            retrieve: "retrieve",
            direct: "direct",
            calculator: "calculator",
        }
    );

    // Retrieval Flow
    graph.addEdge(
        "retrieve",
        "generate"
    );

    // Reflection Flow
    graph.addEdge(
        "generate",
        "reflection_agent"
    );

    graph.addEdge(
        "direct",
        "reflection_agent"
    );

    graph.addEdge(
        "calculator",
        "reflection_agent"
    );

    // Retry Logic
    graph.addConditionalEdges(
        "reflection_agent",
        (state) => {
            if (
                state.reflection === "bad" &&
                state.retryCount < 1
            ) {
                return "retry";
            }

            return "end";
        },
        {
            retry: "router",
            end: END,
        }
    );

    return graph.compile();
};

module.exports = {
    buildRagGraph,
};