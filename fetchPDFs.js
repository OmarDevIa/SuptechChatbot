// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const path = require('path');

// // URL du site à scraper
// const baseUrl = 'https://www.suptech.tn'; // Remplacez par l'URL du site cible

// // Fonction pour récupérer les liens PDF
// async function fetchPDFLinks() {
//     try {
//         const response = await axios.get(baseUrl);
//         const $ = cheerio.load(response.data);

//         // Sélectionner tous les liens qui pointent vers des fichiers PDF
//         const pdfLinks = [];
//         $('a[href$=".pdf"]').each((index, element) => {
//             const link = $(element).attr('href');
//             const fullLink = link.startsWith('http') ? link : `${baseUrl}${link}`;
//             pdfLinks.push(fullLink);
//         });

//         console.log('Liens PDF trouvés :', pdfLinks);
//         return pdfLinks;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des liens PDF :', error);
//         return [];
//     }
// }
// // Fonction pour télécharger les fichiers PDF
// async function downloadPDFs(pdfLinks) {
//     const documentsPath = path.join(__dirname, 'documents'); // Dossier pour stocker les fichiers
//     if (!fs.existsSync(documentsPath)) {
//         fs.mkdirSync(documentsPath); // Créer le dossier s'il n'existe pas
//     }

//     for (const link of pdfLinks) {
//         const fileName = path.basename(link); // Nom du fichier
//         const filePath = path.join(documentsPath, fileName);

//         try {
//             const response = await axios({
//                 url: link,
//                 method: 'GET',
//                 responseType: 'stream',
//             });

//             const writer = fs.createWriteStream(filePath);
//             response.data.pipe(writer);

//             console.log(`Téléchargé : ${fileName}`);
//         } catch (error) {
//             console.error(`Erreur lors du téléchargement de ${link} :`, error);
//         }
//     }
// }(async () => {
//     const pdfLinks = await fetchPDFLinks(); // Récupérer les liens PDF
//     if (pdfLinks.length > 0) {
//         await downloadPDFs(pdfLinks); // Télécharger les fichiers PDF
//     } else {
//         console.log('Aucun fichier PDF trouvé.');
//     }
// })();const pdf = require('pdf-parse');

// async function extractTextFromPDF(filePath) {
//     const fileBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdf(fileBuffer);
//     return pdfData.text; // Contenu du PDF
// }

// // Exemple d'utilisation
// const filePath = path.join(__dirname, 'documents', 'example.pdf');
// extractTextFromPDF(filePath).then((text) => {
//     console.log('Contenu du PDF :', text);
// });
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// URL du site à scraper
const baseUrl = 'https://www.suptech.tn'; // Remplacez par l'URL du site cible

// Fonction pour récupérer les liens PDF
async function fetchPDFLinks() {
    try {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);

        // Sélectionner tous les liens qui pointent vers des fichiers PDF
        const pdfLinks = [];
        $('a[href$=".pdf"]').each((index, element) => {
            const link = $(element).attr('href');
            const fullLink = link.startsWith('http') ? link : `${baseUrl}${link}`;
            pdfLinks.push(fullLink);
        });

        console.log('Liens PDF trouvés :', pdfLinks);
        return pdfLinks;
    } catch (error) {
        console.error('Erreur lors de la récupération des liens PDF :', error);
        return [];
    }
}

// Fonction pour télécharger les fichiers PDF
async function downloadPDFs(pdfLinks) {
    const documentsPath = path.join(__dirname, 'documents'); // Dossier pour stocker les fichiers
    if (!fs.existsSync(documentsPath)) {
        fs.mkdirSync(documentsPath); // Créer le dossier s'il n'existe pas
    }

    for (const link of pdfLinks) {
        const fileName = path.basename(link); // Nom du fichier
        const filePath = path.join(documentsPath, fileName);

        try {
            const response = await axios({
                url: link,
                method: 'GET',
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            // Attendre la fin de l'écriture
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`Téléchargé : ${fileName}`);
        } catch (error) {
            console.error(`Erreur lors du téléchargement de ${link} :`, error);
        }
    }
}

// Fonction pour extraire le texte d'un fichier PDF
async function extractTextFromPDF(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Fichier introuvable : ${filePath}`);
        return 'Fichier introuvable.';
    }

    const fileBuffer = fs.readFileSync(filePath);

    if (fileBuffer.length === 0) {
        console.error(`Le fichier est vide : ${filePath}`);
        return 'Le fichier est vide.';
    }

    try {
        const pdfData = await pdf(fileBuffer);
        return pdfData.text; // Contenu du PDF
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier PDF : ${error.message}`);
        return 'Erreur lors de la lecture du fichier PDF.';
    }
}

// Exemple d'utilisation
(async () => {
    const pdfLinks = await fetchPDFLinks(); // Récupérer les liens PDF
    if (pdfLinks.length > 0) {
        await downloadPDFs(pdfLinks); // Télécharger les fichiers PDF

        // Exemple : Extraire le texte d'un fichier PDF spécifique
        const filePath = path.join(__dirname, 'documents', 'example.pdf');
        const text = await extractTextFromPDF(filePath);
        console.log('Contenu du PDF :', text);
    } else {
        console.log('Aucun fichier PDF trouvé.');
    }
})();