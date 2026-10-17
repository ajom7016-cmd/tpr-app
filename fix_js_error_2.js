const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/querySelector\('i'\)/g, "querySelector('.material-symbols-outlined')");

fs.writeFileSync(file, text);
console.log('Fixed ALL querySelector(i) instances');
