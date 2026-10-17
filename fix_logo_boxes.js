const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Make logo-box CSS background transparent
content = content.replace(
    /\.logo-box \{\s*background: white;/g,
    '.logo-box {\n            background: transparent;'
);

// 2. Remove shadow and border from the HTML element
content = content.replace(
    /class="logo-box w-12 h-12 shadow-sm border border-slate-100"/g,
    'class="logo-box w-12 h-12"'
);

fs.writeFileSync(file, content);
console.log('Removed white background and borders from method logos');
