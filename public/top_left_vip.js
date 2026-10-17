const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const searchRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] pt-1">\s*<span class="text-\[26px\] font-black text-slate-800 tracking-widest leading-none mb-0 z-10 relative">VIP<\/span>\s*<span class="text-\[75px\] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-md tracking-tighter mt-\[-8px\] relative z-0" style="line-height: 0\.85;">(\d)<\/span>\s*<span class="text-red-600 font-bold text-\[13px\] mt-3 text-center leading-tight">Capital Return<br><span class="text-slate-600 font-medium text-\[11px\]">(\d+ Days)<\/span><\/span>\s*<\/div>/g;

const replaceString = `<div class="absolute -top-6 left-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-[16px] font-black tracking-widest px-6 py-1 rounded-[10px] shadow-lg border border-slate-700 z-20">VIP</div>
                <div class="flex flex-col items-center justify-center w-[45%] pt-4">
                    <span class="text-[85px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-md tracking-tighter leading-none" style="line-height: 0.85;">$1</span>
                    <span class="text-red-600 font-bold text-[14px] mt-4 text-center leading-tight">Capital Return<br><span class="text-slate-600 font-medium text-[12px]">$2</span></span>
                </div>`;

html = html.replace(searchRegex, replaceString);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP badge moved to top left and numbers centered');
