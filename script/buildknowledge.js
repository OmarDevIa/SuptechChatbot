const fs = require('fs');
const path = require('path');
const { extractTextFromPDF } = require('../services/pdfReader');

// Dossier des PDF
const docsDir = path.join(__dirname, 'docs');
// Chemin de sortie
const outputPath = path.join(__dirname, '../data/knowledge.txt');

// Fonction principale
async function buildKnowledgeBase() {
    const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.pdf'));

    let fullText = '';

    for (const file of files) {
        const filePath = path.join(docsDir, file);
        console.log(`Traitement de : ${file}...`);
        const text = await extractTextFromPDF(filePath);

        fullText += `\n---\nFichier : ${file}\n${text.trim()}\n`;
    }

    fs.writeFileSync(outputPath, fullText);
    console.log('✅ Base de connaissance générée dans data/knowledge.txt');
}

buildKnowledgeBase();
