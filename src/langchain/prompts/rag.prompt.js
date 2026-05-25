const {
    ChatPromptTemplate,
} = require("@langchain/core/prompts");

const ragPrompt =
    ChatPromptTemplate.fromTemplate(`
You are a helpful AI PDF assistant.

Use the conversation history and provided context
to answer the user's question.

If answer is not present in the context, say:
"I could not find this information in the uploaded document."

Do not make up information.

Conversation History:
{history}

Context:
{context}

Question:
{input}
`);

module.exports = {
    ragPrompt,
};