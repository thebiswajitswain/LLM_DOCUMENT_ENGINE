const cleanText = (text) => {
    return text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .trim();
};

const splitTextIntoChunks = (text, chunkSize = 700, overlap = 100) => {
    const cleanedText = cleanText(text);

    const words = cleanedText.split(" ");

    const chunks = [];

    if (words.length === 0) {
        return chunks;
    }

    let start = 0;
    let chunkIndex = 0;

    while (start < words.length) {
        const end = Math.min(start + chunkSize, words.length);

        const chunkWords = words.slice(start, end);

        const chunkText = chunkWords.join(" ").trim();

        if (chunkText.length > 0) {
            chunks.push({
                chunkIndex,
                text: chunkText,
                wordCount: chunkWords.length,
            });
        }

        if (end === words.length) {
            break;
        }

        start = end - overlap;

        chunkIndex++;
    }

    return chunks;
};

module.exports = {
    cleanText,
    splitTextIntoChunks,
};