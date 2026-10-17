const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

content = content.replace(
    '<body class="min-h-[100dvh] flex flex-col text-slate-800 p-4 pb-24">',
    '<body class="min-h-[100dvh] flex flex-col text-slate-800 p-4 pt-[90px] pb-24">'
);

fs.writeFileSync(f, content);
console.log('Added top padding to prevent header overlap');
