// ====== Initialisation générale ======

// Audio pour bip sonore
const sendSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_9e3b1f2bb9.mp3?filename=pop-94319.mp3');

// Fonction utilitaire pour jouer le bip sonore
function playSound() {
    sendSound.currentTime = 0;
    sendSound.play();
}

// Fonction utilitaire pour ajouter une animation
function animateMessage(element) {
    element.classList.add('fade-slide-in');
    setTimeout(() => {
        element.classList.add('visible');
    }, 50);
}

// ====== Fonctions principales ======

// Fonction pour afficher un message dans le chat
function addMessageToChatLog(message, sender = 'bot') {
    const chatLog = document.getElementById('chat-log');
    const messageContainer = document.createElement('div');
    messageContainer.className = sender === 'bot' ? 'bot-message-container' : 'user-message-container';

    const logo = document.createElement('img');
    if (sender === 'bot') {
        logo.src = 'bot_logo.png'; // Chemin vers le logo du bot
        logo.alt = 'Bot Logo';
        logo.className = 'bot-logo';
    } else if (sender === 'user') {
        logo.src = 'user.jpeg'; // Chemin vers le logo de l'utilisateur
        logo.alt = 'User Logo';
        logo.className = 'user-logo';
    } else if (sender === 'error') {
        logo.src = 'error.png'; // Chemin vers le logo d'erreur
        logo.alt = 'Error Logo';
        logo.className = 'error-logo';
    }

    const messageElement = document.createElement('div');
    messageElement.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageElement.textContent = message;

    if (sender === 'bot' || sender === 'error') {
        messageContainer.appendChild(logo);
        messageContainer.appendChild(messageElement);
    } else {
        messageContainer.appendChild(messageElement);
        messageContainer.appendChild(logo);
    }

    chatLog.appendChild(messageContainer);
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });

    playSound(); // jouer un bip à chaque message
}

// Fonction pour afficher et cacher le loader
function toggleLoader(show) {
    const loader = document.getElementById('loading-indicator');
    loader.style.display = show ? 'block' : 'none';
}

// Fonction pour envoyer un message
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
    if (!userMessage) {
        addMessageToChatLog("Veuillez entrer un message avant d'envoyer.", 'bot');
        return;
    }

    addMessageToChatLog(userMessage, 'user');
    userInput.value = '';

    toggleLoader(true); // Afficher le loader

    fetch('/getChatbotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            toggleLoader(false);
            const botResponse = data.chatbotResponse || "Je suis désolé, je n'ai pas compris votre question. Pouvez-vous la reformuler ou poser une autre question ?";
            addMessageToChatLog(botResponse, 'bot');
        })
        .catch(error => {
            toggleLoader(false);
            console.error('Erreur:', error);
            addMessageToChatLog('Désolé, une erreur est survenue. Veuillez réessayer plus tard.', 'error');
        });
}

// Fonction pour redémarrer la conversation
function restartChat() {
    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML = '';
    addMessageToChatLog("Bonjour ! Je m'appelle Jane, je suis le chatbot pour répondre à vos questions concernant l'université Suptech. Comment puis-je vous aider ?", 'bot');
}

// ====== Reconnaissance vocale ======

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;

    recognition.onstart = () => {
        addMessageToChatLog("🎙️ Écoute en cours...", 'bot');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessageToChatLog(transcript, 'user');
        sendMessageFromVoice(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        addMessageToChatLog("Désolé, je n'ai pas pu comprendre. Veuillez réessayer.", 'error');
    };

    recognition.onend = () => {
        addMessageToChatLog("🎙️ Reconnaissance vocale terminée.", 'bot');
    };

    recognition.start();
}

// Fonction pour envoyer un message issu de la voix
function sendMessageFromVoice(userMessage) {
    toggleLoader(true);

    fetch('/getChatbotResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau');
            return response.json();
        })
        .then(data => {
            toggleLoader(false);
            const botResponse = data.chatbotResponse || "Je suis désolé, je n'ai pas compris votre question. Pouvez-vous la reformuler ou poser une autre question ?";
            addMessageToChatLog(botResponse, 'bot');
        })
        .catch(error => {
            toggleLoader(false);
            console.error('Erreur:', error);
            addMessageToChatLog('Désolé, une erreur est survenue. Veuillez réessayer plus tard.', 'error');
        });
}

// ====== Chargement initial ======
window.onload = () => {
    restartChat();
};
// Fonction pour ajouter le spinner dans le chat-log
function showLoadingIndicator() {
    const chatLog = document.getElementById('chat-log');
    const loader = document.createElement('div');
    loader.className = 'loader bot-message'; // comme un message du bot
    loader.id = 'loading-indicator';
    chatLog.appendChild(loader);
    chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: 'smooth' });
}

// Fonction pour retirer le spinner du chat-log
function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}