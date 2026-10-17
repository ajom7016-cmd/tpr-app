const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /\.method-card\.active \{\s*border-color: #ea580c;/g,
    '.method-card.active {\n            border-color: rgba(255,255,255,1);'
);

fs.writeFileSync(file, content);
console.log('Removed orange border from active method cards');
