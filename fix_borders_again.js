const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Restore the orange border to the card
content = content.replace(
    /\.method-card\.active \{\s*border-color: rgba\(255,255,255,1\);/g,
    '.method-card.active {\n            border-color: #ea580c;'
);

// 2. Remove the border from the radio button (check-circle) when active
content = content.replace(
    /\.method-card\.active \.check-circle \{ border-color: #ea580c; \}/g,
    '.method-card.active .check-circle { border-color: transparent; }'
);

fs.writeFileSync(file, content);
console.log('Restored card border, removed radio button border');
