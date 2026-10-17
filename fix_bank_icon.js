const fs = require('fs');

let file = 'public/bank_details_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// 1. Make btn-add smaller
text = text.replace(/padding: 18px;/g, 'padding: 14px;');
text = text.replace(/border-radius: 20px;/g, 'border-radius: 16px;');

// 2. Fix the header to include the "light black" wallet icon
const oldHeader = `<div class="flex items-center justify-between mb-8">
                <h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full">Bank Details</h1>
            </div>`;

const newHeader = `<div class="flex items-center justify-between mb-6">
                <div class="w-12 h-12 rounded-[14px] bg-slate-800 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <span class="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <h1 class="text-[24px] font-black text-slate-800 tracking-tight text-right w-full">Bank Details</h1>
            </div>`;

if (text.includes(oldHeader)) {
    text = text.replace(oldHeader, newHeader);
}

fs.writeFileSync(file, text);
console.log('Fixed bank_details_glass header and button');
