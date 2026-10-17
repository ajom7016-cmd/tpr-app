const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/transform:\s*translateX\(-50%\);/g, 'transform: translateX(calc(-50% - 1px));');

fs.writeFileSync(file, text);
console.log('Moved bottom nav 1px to the left');
