const fs = require('fs');
let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/bottomNavIdx: 2 \},/g, 'bottomNavIdx: null },');
text = text.replace(/icon: 'diamond', bottomNavIdx: null \},/g, "icon: 'diamond', bottomNavIdx: 2 },");

fs.writeFileSync(file, text);
console.log('Fixed appPages bottomNavIdx');
