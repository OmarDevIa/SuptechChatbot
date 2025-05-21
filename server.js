const express = require('express'); // Importer Express
const app = express(); // Initialiser l'application Express
const port = 3000; // Définir le port
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromPDF } = require('./services/pdfReader');
const { handleQuestion } = require('./services/rag');
const upload = multer({ dest: 'uploads/' });

app.use(express.json()); // Middleware pour analyser les requêtes JSON
app.use(express.static('public')); // Servir les fichiers statiques depuis le dossier "public"

// Route pour la racine
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Servir la page d'accueil
});

// Route pour le chatbot
app.post('/getChatbotResponse', async (req, res) => {
    const userMessage = req.body.userMessage.toLowerCase();

    // Utiliser RAG pour obtenir une réponse
    try {
        const response = await handleQuestion(userMessage);
        if (!response) {
            res.json({ chatbotResponse: "Désolé, je ne trouve pas d'information à ce sujet dans nos documents." });
        } else {
            res.json({ chatbotResponse: response });
        }
    } catch (error) {
        console.error('Erreur lors de l\'interrogation de RAG:', error);
        res.json({ chatbotResponse: "Désolé, une erreur est survenue. Veuillez réessayer plus tard." });
    }
});

// Route pour télécharger un PDF et l'intégrer à la base de connaissance
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const text = await extractTextFromPDF(req.file.path);
        const knowledgePath = path.join(__dirname, 'data/knowledge.txt');
        fs.appendFileSync(knowledgePath, `\n${text}`);
        res.send({ message: "PDF intégré à la base de connaissance." });
    } catch (error) {
        console.error('Erreur lors du traitement du PDF:', error);
        res.status(500).send({ message: "Erreur lors du téléchargement du PDF." });
    }
});

// Route pour interroger le RAG directement
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    try {
        const response = await handleQuestion(question);
        res.json({ response });
    } catch (error) {
        console.error('Erreur lors de l\'interrogation de RAG:', error);
        res.json({ response: "Désolé, une erreur est survenue." });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
