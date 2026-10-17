const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /\.method-card\.active \.check-circle \{ border-color: transparent; \}/g,
    '.method-card.active .check-circle { border-color: #ea580c; }'
);

fs.writeFileSync(file, content);
console.log('Restored orange ring around the radio button dot');
