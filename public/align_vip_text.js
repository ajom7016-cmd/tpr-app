const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Replace standard VIPs (1, 2, 4, 5, 6)
const searchRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] relative">\s*<div class="absolute -top-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-\[16px\] font-black tracking-widest px-5 py-1 rounded-\[12px\] shadow-\[0_10px_20px_rgba\(0,0,0,0\.2\)\] border border-slate-700\/50 z-20">VIP<\/div>\s*<span class="glowing-number mt-2">(\d)<\/span>\s*<span class="text-red-600 font-bold text-\[13px\] mt-5 text-center leading-tight">Capital Return<br><span class="text-slate-600 font-medium text-\[11px\]">(\d+ Days)<\/span><\/span>\s*<\/div>/g;

const replaceString = `<div class="flex flex-col items-center justify-center w-[45%] pt-2">
                    <div class="flex items-baseline justify-center gap-1.5 mb-2">
                        <span class="text-[24px] font-black text-slate-800 tracking-tighter">VIP</span>
                        <span class="text-[65px] font-black text-red-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(239,68,68,0.2);">$1</span>
                    </div>
                    <span class="text-red-600 font-bold text-[14px] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">$2</span></span>
                </div>`;

html = html.replace(searchRegex, replaceString);

// Replace VIP 3 (Gold)
const searchGoldRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] relative">\s*<div class="absolute -top-6 bg-gradient-to-br from-yellow-500 to-amber-600 text-white text-\[16px\] font-black tracking-widest px-5 py-1 rounded-\[12px\] shadow-\[0_10px_20px_rgba\(245,158,11,0\.3\)\] border border-yellow-400\/50 z-20">VIP<\/div>\s*<span class="glowing-number glowing-number-gold mt-2">3<\/span>\s*<span class="text-amber-600 font-bold text-\[13px\] mt-5 text-center leading-tight">Capital Return<br><span class="text-slate-600 font-medium text-\[11px\]">24 Days<\/span><\/span>\s*<\/div>/g;

const replaceGoldString = `<div class="flex flex-col items-center justify-center w-[45%] pt-2">
                    <div class="flex items-baseline justify-center gap-1.5 mb-2">
                        <span class="text-[24px] font-black text-slate-800 tracking-tighter">VIP</span>
                        <span class="text-[65px] font-black text-orange-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(249,115,22,0.2);">3</span>
                    </div>
                    <span class="text-orange-600 font-bold text-[14px] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">24 Days</span></span>
                </div>`;

html = html.replace(searchGoldRegex, replaceGoldString);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Text aligned to side successfully');
