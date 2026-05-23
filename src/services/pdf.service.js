const fs = require("fs");
const pdfParseModule = require("pdf-parse");

const pdfParse = pdfParseModule.default || pdfParseModule;

const extractTextFromPdf = async (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(fileBuffer);

    return {
        text: pdfData.text,
        totalPages: pdfData.numpages,
        info: pdfData.info,
    };
};

module.exports = {
    extractTextFromPdf,
};