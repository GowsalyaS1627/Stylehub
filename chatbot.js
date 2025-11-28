// Chatbot JS (externalized for reuse by multiple pages)
(function() {
    const chatToggle = document.getElementById('chat-toggle');
    if (!chatToggle) return; // no widget on this page
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    function togglePanel(open) {
        if (open === undefined) open = chatPanel.classList.contains('hidden');
        chatPanel.classList.toggle('hidden', !open);
        chatPanel.setAttribute('aria-hidden', String(!open));
        if (open) {
            chatInput.focus();
        }
    }

    function appendMessage(from, text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex';
        const bubble = document.createElement('div');
        bubble.className = (from === 'user')
            ? 'ml-auto max-w-[80%] bg-primary text-white px-3 py-2 rounded-lg rounded-br-none'
            : 'mr-auto max-w-[80%] bg-white dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-2 rounded-lg rounded-bl-none border border-slate-200 dark:border-slate-700';
        bubble.innerText = text;
        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'flex items-center gap-2';
        typing.innerHTML = `<div class="w-10 ml-1 flex items-center gap-1"><span class="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span><span class="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span></div>`;
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typing;
    }

    function getBotResponse(input) {
        const q = input.toLowerCase();
        if (/(hi|hello|hey|good morning|good afternoon)/.test(q)) return 'Hello! 👋 How can I help you today? I can answer questions about orders, shipping, returns, and product info.';
        if (/(shipping|deliver|delivery|ship)/.test(q)) return 'Our standard shipping typically takes 3-5 business days. You can upgrade to express at checkout.';
        if (/(return|refund|exchange)/.test(q)) return 'You can return items within 30 days of delivery. Please ensure items are unused and in original packaging.';
        if (/(order|track)/.test(q)) return 'To track your order, go to the "Orders" page (click on your profile) and enter your order number. Need help finding it?';
        if (/(hours|open|close)/.test(q)) return 'Our support team is available Mon-Fri, 9am-5pm; orders ship during business days.';
        if (/(help|support|contact)/.test(q)) return 'You can reach our support team via the Contact page or email support@stylehub.example. Would you like the Contact page link?';
        return "I'm sorry, I didn't understand that. Ask about shipping, returns, orders, or contact info — or type 'help' for options.";
    }

    chatToggle.addEventListener('click', () => togglePanel(true));
    chatClose.addEventListener('click', () => togglePanel(false));

    chatForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;
        appendMessage('user', message);
        chatInput.value = '';

        const typingEl = showTyping();
        await new Promise((r) => setTimeout(r, 700));
        const botText = getBotResponse(message);
        typingEl.remove();
        appendMessage('bot', botText);
    });

    // Close with Escape key for accessibility
    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
            togglePanel(false);
        }
    });

    // Optional: you can replace getBotResponse with a function that calls an API for smarter replies.
})();
