const fs = require('fs');
const path = require('path');
const { extractTextFromPDF } = require('../services/pdfReader');

const folderPath = path.join(__dirname, 'docs'); // Chemin vers le dossier contenant les PDF
const knowledgePath = path.join(__dirname, '../data/knowledge.json'); // Chemin vers le fichier JSON

async function loadAllPDFs() {
    // Vérifier si le fichier JSON existe, sinon le créer
    let knowledge = [];
    if (fs.existsSync(knowledgePath)) {
        knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    }

    // Lire les fichiers PDF dans le dossier
    fs.readdir(folderPath, async (err, files) => {
        if (err) {
            console.error('Erreur lors de la lecture du dossier:', err);
            return;
        }

        const pdfFiles = files.filter(file => file.endsWith('.pdf'));

        if (pdfFiles.length === 0) {
            console.log('Aucun fichier PDF trouvé dans le dossier.');
            return;
        }

        for (const file of pdfFiles) {
            const filePath = path.join(folderPath, file);
            console.log(`Lecture du fichier: ${filePath}`);

            try {
                const text = await extractTextFromPDF(filePath);
                if (text.trim() === '') {
                    console.log(`Le fichier ${file} ne contient aucun texte lisible.`);
                } else {
                    console.log(`Contenu extrait du fichier ${file}:\n${text}`);
                    // Ajouter le contenu extrait au tableau JSON
                    knowledge.push({ content: text });
                }
            } catch (error) {
                console.error(`Erreur lors de l'analyse de ${file}:`, error);
            }
        }

        // Écrire les données dans le fichier JSON
        fs.writeFileSync(knowledgePath, JSON.stringify(knowledge, null, 2));
        console.log('Les données ont été ajoutées à knowledge.json.');
    });
}

loadAllPDFs();