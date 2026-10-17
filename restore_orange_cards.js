const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Restore the active card border to orange
content = content.replace(
    /\.method-card\.active \{\s*border-color: #64748b;/g,
    '.method-card.active {\n            border-color: #ea580c;'
);

// 2. Restore the active radio button border to orange
content = content.replace(
    /\.method-card\.active \.check-circle \{ border-color: #64748b; \}/g,
    '.method-card.active .check-circle { border-color: #ea580c; }'
);

// 3. Restore the inner radio button dot to orange
content = content.replace(
    /bg-slate-500 opacity-0 transition-opacity/g,
    'bg-orange-500 opacity-0 transition-opacity'
);

fs.writeFileSync(file, content);
console.log('Restored orange active state for method cards');
