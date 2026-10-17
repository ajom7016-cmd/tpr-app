const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/gemini-2\.5-flash/g, 'gemini-3.6-flash');
content = content.replace(/gemini-1\.5-flash/g, 'gemini-3.5-flash');

fs.writeFileSync(file, content);
console.log('Fixed Gemini model names to the recommended gemini-3.6-flash');
