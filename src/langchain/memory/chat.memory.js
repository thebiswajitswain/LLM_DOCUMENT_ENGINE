const chatHistoryStore = {};

// Get session history
const getSessionHistory = (sessionId) => {
    if (!chatHistoryStore[sessionId]) {
        chatHistoryStore[sessionId] = [];
    }

    return chatHistoryStore[sessionId];
};

// Add message to history
const addMessageToHistory = ({
    sessionId,
    role,
    content,
}) => {
    if (!chatHistoryStore[sessionId]) {
        chatHistoryStore[sessionId] = [];
    }

    chatHistoryStore[sessionId].push({
        role,
        content,
    });
};

module.exports = {
    getSessionHistory,
    addMessageToHistory,
};