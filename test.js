import { handleQuestion } from './services/rag.js'; // Importer la fonction handleQuestion
import config from './config.js'; // Importer la configuration

(async () => {
  try {
    // Vérification de la clé API
    if (!config.openai.apiKey) {
      throw new Error("La clé API OpenAI n'est pas définie dans config.js");
    }

    console.log("Utilisation de la clé API OpenAI :", config.openai.apiKey);

    // Appel de la fonction handleQuestion avec une question
    const response = await handleQuestion("Quel est le sujet principal des documents ?");
    console.log("Réponse :", response);
  } catch (error) {
    console.error("Erreur lors de l'exécution de handleQuestion :", error.message);
  }
})();