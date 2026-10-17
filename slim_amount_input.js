const fs = require('fs');

let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Update currency symbol
content = content.replace(
    /<div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">\s*<span class="text-slate-500 font-bold text-\[18px\]">৳<\/span>\s*<\/div>/,
    '<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">\n                    <span class="text-slate-500 font-bold text-[16px]">৳</span>\n                </div>'
);

// Update input field
content = content.replace(
    /class="input-glass w-full py-4 pl-11 pr-20 rounded-\[20px\] text-\[20px\] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-medium"/,
    'class="input-glass w-full py-3.5 pl-10 pr-20 rounded-[16px] text-[16px] font-black text-slate-800 placeholder:text-slate-300 placeholder:font-medium"'
);

// Update MAX button
content = content.replace(
    /class="bg-slate-100 border border-slate-200 text-slate-600 font-black text-\[11px\] px-4 py-2 rounded-\[12px\] hover:bg-slate-200 active:scale-95 transition-all uppercase tracking-wider">MAX<\/button>/,
    'class="bg-slate-100 border border-slate-200 text-slate-600 font-black text-[11px] px-3 py-1.5 rounded-[10px] hover:bg-slate-200 active:scale-95 transition-all uppercase tracking-wider">MAX</button>'
);

fs.writeFileSync(file, content);
console.log('Made amount input and text slimmer');
