const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

const knowledgeBasePath = path.join(__dirname, '../data/knowledge_base.json');

// Charger toutes les questions et réponses depuis le fichier centralisé
function loadAllKnowledge() {
    try {
        const content = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));
        if (content && content.questions_answers) {
            console.log("📚 Base de connaissances chargée avec succès !");
            return content.questions_answers;
        } else {
            console.warn("⚠️ Le fichier knowledge_base.json est vide ou mal formaté.");
            return [];
        }
    } catch (err) {
        console.error(`❌ Erreur lors du chargement du fichier knowledge_base.json:`, err.message);
        return [];
    }
}

// Rechercher une réponse dans la base de connaissances avec similarité
function findAnswer(question, knowledgeBase) {
    console.log("🔍 Question posée :", question);
    const lowerCaseQuestion = question.toLowerCase();

    // Extraire toutes les questions de la base de connaissances
    const questions = knowledgeBase.map(qa => qa.question.toLowerCase());

    // Trouver la question la plus similaire
    const bestMatch = stringSimilarity.findBestMatch(lowerCaseQuestion, questions);

    // Vérifier si la similarité dépasse un seuil (par exemple, 0.5)
    if (bestMatch.bestMatch.rating > 0.5) {
        const matchedQuestion = bestMatch.bestMatch.target;
        console.log("✅ Question correspondante trouvée :", matchedQuestion);

        // Retourner la réponse correspondante
        const qa = knowledgeBase.find(qa => qa.question.toLowerCase() === matchedQuestion);
        return qa.answer;
    }

    console.log("❌ Aucune correspondance suffisante trouvée.");
return "Je n'ai pas trouvé d'information pour votre question. Pouvez-vous la reformuler ou poser une autre question ?";}

// Fonction principale pour traiter la question
function handleQuestion(question) {
    const knowledgeBase = loadAllKnowledge();
    return findAnswer(question, knowledgeBase);
}

module.exports = { handleQuestion };