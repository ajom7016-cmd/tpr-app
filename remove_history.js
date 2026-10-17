const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<!-- History -->[\s\S]*?<span class="text-\[13px\] font-bold text-slate-800">History<\/span>\s*<\/div>/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Removed History button from dashboard');
