const fs = require('fs');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

async function extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);

    try {
        const data = await pdfParse(dataBuffer);
        if (data.text.trim() === '') {
            console.log(`Le fichier ${filePath} ne contient pas de texte lisible. Tentative d'OCR...`);
            const { data: { text } } = await Tesseract.recognize(filePath, 'fra'); // 'fra' pour le français
            return text;
        }
        return data.text;
    } catch (error) {
        console.error(`Erreur lors de l'extraction du texte du fichier ${filePath}:`, error);
        return '';
    }
}

module.exports = { extractTextFromPDF };