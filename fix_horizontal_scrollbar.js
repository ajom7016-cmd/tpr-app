const fs = require('fs');

let file = 'public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove scrollbar-hide from tabs-container
content = content.replace(
    '<div class="tabs-container scrollbar-hide px-5 pb-2 -mx-5">',
    '<div class="tabs-container px-5 pb-2 -mx-5">'
);

// 2. Add height to the global scrollbar so horizontal scrollbars become thin
content = content.replace(
    '::-webkit-scrollbar { width: 7px; }',
    '::-webkit-scrollbar { width: 7px; height: 4px; }'
);

fs.writeFileSync(file, content);
console.log('Fixed horizontal scrollbar styling!');
