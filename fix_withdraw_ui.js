const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add back button and update header layout
content = content.replace(
    /<h1 class="text-\[24px\] font-black tracking-tight text-center mb-6">Withdraw Funds<\/h1>/,
    `<div class="flex items-center gap-4 mb-6 relative">
            <button onclick="window.parent.loadPage('user_profile_premium_glass/code.html')" class="w-10 h-10 rounded-full bg-white/40 border border-white/60 flex items-center justify-center backdrop-blur-md shadow-sm active:scale-95 transition-all">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-[24px] font-black tracking-tight text-slate-800">Withdraw Funds</h1>
        </div>`
);

// 2. Make balance card more round
content = content.replace(
    /<div class="glass-panel p-5 mb-6 flex items-center justify-between">/,
    '<div class="glass-panel rounded-[32px] p-6 mb-6 flex items-center justify-between">'
);

// 3. Make wallet icon slate instead of orange
content = content.replace(
    /<div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">/,
    '<div class="w-12 h-12 bg-slate-100/60 border border-white/50 shadow-sm rounded-full flex items-center justify-center">'
);
content = content.replace(
    /<span class="material-symbols-outlined text-orange-500">account_balance_wallet<\/span>/,
    '<span class="material-symbols-outlined text-slate-700">account_balance_wallet</span>'
);

// 4. Make method cards more round
content = content.replace(
    /class="method-card rounded-2xl/g,
    'class="method-card rounded-[28px]'
);

// 5. Make amount input box more round and remove orange focus border
content = content.replace(
    /class="input-glass w-full py-4 pl-10 pr-5 rounded-2xl/g,
    'class="input-glass w-full py-4 pl-10 pr-5 rounded-[28px]'
);
content = content.replace(
    /border-color: #ea580c;/g,
    'border-color: #64748b;'
);

// 6. Make empty state wallet slate instead of orange
content = content.replace(
    /bg-orange-50/g,
    'bg-slate-50'
);
content = content.replace(
    /text-orange-500 text-\[48px\]/g,
    'text-slate-400 text-[48px]'
);

fs.writeFileSync(file, content);
console.log('Fixed styling on withdraw page');
