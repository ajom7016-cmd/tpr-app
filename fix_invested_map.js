const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldMap = "const investedMap = { 0: 0, 1: 1699, 2: 4500, 3: 8900, 4: 15000, 5: 35000, 6: 70000 };";
const newMap = "const investedMap = { 0: 0, 1: 1699, 2: 3199, 3: 6190, 4: 12180, 5: 24150, 6: 48000 };";

content = content.replace(oldMap, newMap);

fs.writeFileSync(file, content);
console.log('Fixed investedMap prices in Dashboard!');
