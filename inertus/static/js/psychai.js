class PsychAIChat {
    constructor() {
        this.messageContainer = document.getElementById('chat-messages');
        this.form = document.getElementById('chat-form');
        this.input = document.getElementById('message-input');
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'typing-indicator';
        this.setupEventListeners();
        this.loadMessageHistory();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }

    async loadMessageHistory() {
        try {
            const response = await fetch('/psychai/history');
            const messages = await response.json();
            messages.forEach(msg => this.displayMessage(msg));
            this.scrollToBottom();
        } catch (error) {
            this.showError('Failed to load message history');
        }
    }

    showTypingIndicator() {
        this.typingIndicator.innerHTML = `
            <div class="typing-bubble"></div>
            <div class="typing-bubble"></div>
            <div class="typing-bubble"></div>
        `;
        this.messageContainer.appendChild(this.typingIndicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.remove();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message) return;

        this.displayMessage({ content: message, type: 'user' });
        this.input.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.sendMessage(message);
            this.hideTypingIndicator();
            this.displayMessage({ content: response.message, type: 'bot' });
        } catch (error) {
            this.hideTypingIndicator();
            this.showError('Failed to send message');
        }
    }

    displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        messageElement.innerHTML = `
            <div class="message-content">${this.formatMessage(message.content)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    formatMessage(content) {
        // Convert URLs to links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
        // Convert markdown-style links
        content = content.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank">$1</a>'
        );
        return content;
    }

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        this.messageContainer.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }
}

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
    new PsychAIChat();
}); 