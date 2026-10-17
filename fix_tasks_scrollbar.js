const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\* Thin iOS Style Scrollbar \*\/[\s\S]*?::-webkit-scrollbar-thumb:hover \{\s*background: rgba\(0, 0, 0, 0\.5\);\s*\}/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Removed conflicting scrollbar CSS!');
