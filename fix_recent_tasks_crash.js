const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the recentTasks fetching logic to be completely foolproof
const oldLogic = `                    if (!recentTasks) recentTasks = [];`;
const newLogic = `                    if (!Array.isArray(recentTasks)) recentTasks = [];`;

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    fs.writeFileSync(file, content);
    console.log('Made recentTasks array check strict.');
} else {
    console.log('Could not find oldLogic');
}
