const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/border-radius:\s*30px;/g, 'border-radius: 22px;');

fs.writeFileSync(file, text);
console.log('Reduced border-radius from 30px to 22px');
