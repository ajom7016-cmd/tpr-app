const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/border-radius:\s*22px;/g, 'border-radius: 26px;');

fs.writeFileSync(file, text);
console.log('Increased border-radius from 22px to 26px');
