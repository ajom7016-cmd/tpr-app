const fs = require('fs');

const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add min-width: 0 to chat-input
content = content.replace(
    /\\.chat-input \\{\\s*flex: 1;/,
    '.chat-input {\\n            flex: 1;\\n            min-width: 0;'
);

// 2. Hide mic button when typing
const cssToInject = \`
        .chat-input:not(:placeholder-shown) ~ div #mic-btn {
            display: none !important;
        }
\`;

if (!content.includes('~ div #mic-btn')) {
    content = content.replace(
        /\\.chat-input:not\\(:placeholder-shown\\) ~ div \\.send-btn-css \\{\\s*display: flex !important;\\s*\\}/,
        '.chat-input:not(:placeholder-shown) ~ div .send-btn-css {\\n            display: flex !important;\\n        }\\n' + cssToInject
    );
}

fs.writeFileSync(file, content);
console.log('Fixed CSS for support page locally');
