const fs = require('fs');
let file = 'public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the buggy chatHistory initialization
const oldInit = "let chatHistory = JSON.parse(localStorage.getItem('tpr_ai_chat_history')) || [];";
const newInit = `        let chatHistory = [];
        try {
            const saved = localStorage.getItem('tpr_ai_chat_history');
            if (saved) {
                chatHistory = JSON.parse(saved) || [];
            }
        } catch (e) {
            console.error('Failed to parse chat history:', e);
            localStorage.removeItem('tpr_ai_chat_history');
        }`;

content = content.replace(oldInit, newInit);

fs.writeFileSync(file, content);
console.log('Fixed chatHistory initialization');
