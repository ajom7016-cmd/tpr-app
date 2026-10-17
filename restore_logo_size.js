const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /class="logo-box w-10 h-10"/g,
    'class="logo-box w-12 h-12"'
);

fs.writeFileSync(file, content);
console.log('Restored logo size to w-12 h-12');
