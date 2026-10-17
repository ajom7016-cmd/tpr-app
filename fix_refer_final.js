const fs = require('fs');

let file = 'public/refer_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the orphaned </div> with the proper header and link block
const injection = `<div class="max-w-[400px] mx-auto px-6 relative z-10 space-y-6">
        <div class="flex items-center justify-center mb-2">
            <h1 class="text-[24px] font-black tracking-tight text-slate-800">My Team</h1>
        </div>
        
        <div class="glass-card mb-6 flex flex-col items-center relative overflow-hidden p-6 w-full text-center">
            <div class="w-full text-left">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">Your Referral Link</p>
                <div class="list-card py-3 px-4">
                    <div class="overflow-hidden">
                        <p id="ref-link-text" class="text-[14px] font-bold text-slate-800 truncate">https://tpr.app/ref/ofuptt</p>
                        <p id="ref-code-text" class="text-[12px] font-semibold text-slate-500 mt-0.5">Code: OFUPTT</p>
                    </div>
                    <button class="w-10 h-10 rounded-full bg-transparent text-slate-800 flex items-center justify-center flex-shrink-0 ml-2 hover:bg-black/5 transition-colors" onclick="copyLink()">
                        <span id="copy-icon" class="material-symbols-outlined text-[22px]">content_copy</span>
                    </button>
                </div>
            </div>
        </div>`;

text = text.replace(/\s*<\/div>\s*<!-- Social Share/, '\n' + injection + '\n\n        <!-- Social Share');
fs.writeFileSync(file, text);
console.log('Fully fixed refer_glass');
