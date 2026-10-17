const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/gemini-3\.7-flash/g, 'gemini-2.5-flash');
content = content.replace(/gemini-3\.5-flash/g, 'gemini-1.5-flash');

fs.writeFileSync(file, content);
console.log('Fixed Gemini model names');
