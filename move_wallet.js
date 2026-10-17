const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

content = content.replace(
    '<div class="flex items-center justify-center">\n                <span class="material-symbols-outlined text-slate-800 text-[28px]">account_balance_wallet</span>',
    '<div class="flex items-center justify-center -mt-3">\n                <span class="material-symbols-outlined text-slate-800 text-[28px]">account_balance_wallet</span>'
);

// If Windows line endings \r\n:
content = content.replace(
    '<div class="flex items-center justify-center">\r\n                <span class="material-symbols-outlined text-slate-800 text-[28px]">account_balance_wallet</span>',
    '<div class="flex items-center justify-center -mt-3">\r\n                <span class="material-symbols-outlined text-slate-800 text-[28px]">account_balance_wallet</span>'
);

fs.writeFileSync(f, content);
console.log('Moved wallet icon up');
