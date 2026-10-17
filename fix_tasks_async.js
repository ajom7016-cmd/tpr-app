const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('async async function generateTasks() {', 'async function generateTasks() {');

fs.writeFileSync(file, content);
console.log('Fixed double async syntax error in Tasks page!');
