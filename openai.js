// filepath: c:\Users\Dell\Downloads\project\software-dev-chatbot\openai.js
const { OpenAIAPIKey } = require('./config'); // Import the API key from config.js

class OpenAIAPI {
/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Sends a request to the OpenAI API to generate a response based on the user's input message
     * and the conversation history.
     * 
     * @param {string} userMessage - The message input from the user.
     * @param {Array} [conversationHistory=[]] - An optional array representing the conversation history 
     *                                           with previous messages.
/*******  3b76eccf-ecd1-49ee-9b7d-0e0fa00c7754  *******/
    static async generateResponse(userMessage, conversationHistory = []) {
        const apiKey = OpenAIAPIKey; // Use the API key from config.js
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
                max_tokens: 150
            }),
        });
        const responseData = await response.json();
        console.log('Response from OpenAI API:', responseData);
        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
            return responseData.choices[0].message.content;
        } else {
            console.error('Error: No valid response from OpenAI API');
            return 'Désolé, je n’ai pas compris ça.';
        }
    }
}
module.exports = { OpenAIAPI };