const fs = require('fs');
let file = 'public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /::-webkit-scrollbar-track \{ background: transparent; \}/;
const replacement = `::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-track:vertical { margin-bottom: 16px; margin-top: 4px; }`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Added margin to vertical scrollbar track to prevent it from hiding under device bezel');
