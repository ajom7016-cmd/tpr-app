const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Replace standard VIPs (1, 2, 4, 5, 6)
const searchRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] pt-2">\s*<div class="flex items-baseline justify-center gap-1\.5 mb-2">\s*<span class="text-\[24px\] font-black text-slate-800 tracking-tighter">VIP<\/span>\s*<span class="text-\[65px\] font-black text-red-500 leading-\[0\.75\] tracking-tighter" style="text-shadow: 0 10px 20px rgba\(239,68,68,0\.2\);">(\d)<\/span>\s*<\/div>\s*<span class="text-red-600 font-bold text-\[14px\] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-\[11px\]">(\d+ Days)<\/span><\/span>\s*<\/div>/g;

const replaceString = `<div class="flex flex-col items-center justify-center w-[45%] pt-1">
                    <span class="text-[26px] font-black text-slate-800 tracking-widest leading-none mb-2">VIP</span>
                    <span class="text-[75px] font-black text-red-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(239,68,68,0.2);">$1</span>
                    <span class="text-red-600 font-bold text-[14px] mt-4 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">$2</span></span>
                </div>`;

html = html.replace(searchRegex, replaceString);

// Replace VIP 3 (Gold)
const searchGoldRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] pt-2">\s*<div class="flex items-baseline justify-center gap-1\.5 mb-2">\s*<span class="text-\[24px\] font-black text-slate-800 tracking-tighter">VIP<\/span>\s*<span class="text-\[65px\] font-black text-orange-500 leading-\[0\.75\] tracking-tighter" style="text-shadow: 0 10px 20px rgba\(249,115,22,0\.2\);">3<\/span>\s*<\/div>\s*<span class="text-orange-600 font-bold text-\[14px\] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-\[11px\]">24 Days<\/span><\/span>\s*<\/div>/g;

const replaceGoldString = `<div class="flex flex-col items-center justify-center w-[45%] pt-1">
                    <span class="text-[26px] font-black text-slate-800 tracking-widest leading-none mb-2">VIP</span>
                    <span class="text-[75px] font-black text-orange-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(249,115,22,0.2);">3</span>
                    <span class="text-orange-600 font-bold text-[14px] mt-4 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">24 Days</span></span>
                </div>`;

html = html.replace(searchGoldRegex, replaceGoldString);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Text aligned below successfully');
