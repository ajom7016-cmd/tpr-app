const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/gemini-3\.6-flash/g, 'gemini-flash-latest');
content = content.replace(/gemini-3\.5-flash/g, 'gemini-flash-lite-latest');

fs.writeFileSync(file, content);
console.log('Fixed Gemini model names to the ultra-fast gemini-flash-latest');
