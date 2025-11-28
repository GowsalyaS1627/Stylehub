# Stylehub Chatbot

This project includes a small, client-side chatbot widget that can be added to any page.

Files added:
- `chatbot.js` - external JS to turn the chat UI into a working widget.

How to include the chatbot on other pages:
1. Paste the chat widget markup (div with `id="chat-widget"` and children) inside the `<body>` of the page where you want the chat widget to appear.
   - The markup used in `index.html` is a complete working sample.
2. Add this script tag near the bottom of the page (before `</body>`):

```html
<script src="chatbot.js"></script>
```

3. The UI uses Tailwind classes (the site already loads Tailwind via CDN); no additional styles are required.

Accessibility notes:
- The chat includes a keyboard escape key handler to close the panel and has `role="dialog"` plus `aria-hidden` toggling.

Optional: Server-backed AI (OpenAI integration)
- The default chatbot uses a simple rule-based engine.
- For smarter responses, implement a server-side endpoint at `/api/ai` that forwards user messages to OpenAI's API (or another provider) and returns a `reply` text field.
- Do NOT embed API keys in frontend JS: always keep them on the server.

Example server flow:
1. Frontend sends POST `/api/ai` with { message }
2. Server calls OpenAI with the message and returns the assistant response in { reply }

Security & privacy:
- Avoid sending personally identifiable information to third-party APIs unless your privacy policy permits it.
- If you store message logs, ensure you comply with laws and your privacy policy requirements.

Customization ideas:
- Add message persistence to localStorage if you want to keep session context.
- Add user identity (e.g., username) to personalize responses.
- Add a setting to switch between rule-based mode and the AI mode.

If you'd like, I can also:
- Add the chat widget to all pages in the workspace (update all HTML files).
- Implement a minimal server to proxy requests to OpenAI for a secure test integration.
- Improve the bot's message styles and transitions.
