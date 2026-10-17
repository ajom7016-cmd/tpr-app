const fs = require('fs');
let file = 'public/bank_details_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// 1. Fix the ID mismatch in JS
text = text.replace(/getElementById\('banks-list'\)/g, "getElementById('bank-list')");

// 2. Update the empty state to be a big beautiful SVG like the transaction page
const oldEmptyState = `'<div class="text-center text-slate-400 mt-8 mb-4"><span class="material-symbols-outlined text-[48px] opacity-50 mb-2">account_balance_wallet</span><br><p class="text-[14px] font-bold">No accounts saved yet.</p></div>'`;

const newEmptyState = `\`
<div class="flex flex-col items-center justify-center mt-12 mb-8">
    <svg class="w-20 h-20 mx-auto text-slate-300 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
    </svg>
    <h3 class="text-[16px] font-black text-slate-700 tracking-tight mb-1">No Payment Methods</h3>
    <p class="text-[12px] font-semibold text-slate-400 text-center">Add your first account to get started.</p>
</div>
\``;

text = text.replace(oldEmptyState, newEmptyState);

fs.writeFileSync(file, text);
console.log('Fixed bank details empty state and ID');
