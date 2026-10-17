const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Change padding from p-4 to py-3 px-4 and gap-4 to gap-3.5
content = content.replace(
    /class="method-card rounded-\[28px\] p-4 flex items-center justify-between/g,
    'class="method-card rounded-[24px] py-3 px-4 flex items-center justify-between'
);

content = content.replace(
    /class="flex items-center gap-4">/g,
    'class="flex items-center gap-3.5">'
);

// 2. Change logo box size from w-12 h-12 to w-10 h-10
content = content.replace(
    /class="logo-box w-12 h-12"/g,
    'class="logo-box w-10 h-10"'
);

fs.writeFileSync(file, content);
console.log('Made withdraw cards slimmer');
