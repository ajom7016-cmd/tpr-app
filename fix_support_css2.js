const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /\\.chat-input \\{\\s*flex: 1;/,
    '.chat-input {\\n            flex: 1;\\n            min-width: 0;'
);

const oldRule = '.chat-input:not(:placeholder-shown) ~ div .send-btn-css {\\n            display: flex !important;\\n        }';
const newRule = oldRule + '\\n        .chat-input:not(:placeholder-shown) ~ div #mic-btn {\\n            display: none !important;\\n        }';

content = content.replace(
    /\\.chat-input:not\\(:placeholder-shown\\) ~ div \\.send-btn-css \\{\\s*display: flex !important;\\s*\\}/,
    newRule
);

fs.writeFileSync(file, content);
console.log('Fixed CSS for support page locally');
