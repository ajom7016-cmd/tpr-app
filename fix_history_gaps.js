const fs = require('fs');

let file = 'public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove space-y-6 from the parent, because it causes inconsistent margins when siblings are hidden
content = content.replace(
    '<div class="max-w-[400px] mx-auto relative z-10 space-y-6 pt-1">',
    '<div class="max-w-[400px] mx-auto relative z-10 pt-1">'
);

// 2. Add explicit margin-bottom to h1
content = content.replace(
    '<h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full mb-6">Transaction History</h1>',
    '<h1 class="text-[20px] font-black text-slate-800 tracking-tight text-center w-full mb-6">Transaction History</h1>'
); // Already has mb-6

// 3. Set the top gap (padding-bottom on tabs-container) to pb-3 (12px)
content = content.replace(
    '<div class="tabs-container px-5 pb-4 -mx-5">',
    '<div class="tabs-container px-5 pb-3 -mx-5">'
);

// 4. Set the bottom gap (margin-top on tx-list) to half of the top gap (mt-2 = 8px)
content = content.replace(
    '<div id="tx-list" class="relative z-10 glass-container hidden">',
    '<div id="tx-list" class="relative z-10 glass-container hidden mt-2">'
);

// Do the same for empty-state and loading-state just in case they render
content = content.replace(
    '<div id="loading-state" class="flex flex-col items-center justify-center mt-10">',
    '<div id="loading-state" class="flex flex-col items-center justify-center mt-8">'
);
content = content.replace(
    '<div id="empty-state" class="flex flex-col items-center justify-center mt-10 hidden">',
    '<div id="empty-state" class="flex flex-col items-center justify-center mt-8 hidden">'
);

fs.writeFileSync(file, content);
console.log('Fixed History page layout gaps');
