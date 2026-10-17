const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// The current format is:
// <div class="flex flex-col items-center justify-center w-[45%] pt-2">
//     <div class="flex items-center justify-center gap-1.5 mb-2">
//         <span class="text-[24px] font-black text-slate-800 tracking-tighter mt-4">VIP</span>
//         <span class="text-[65px] font-black text-orange-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(249,115,22,0.2);">1</span>
//     </div>
//     <span class="text-red-600 font-bold text-[14px] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">32 Days</span></span>
// </div>

const searchRegex = /<div class="flex items-center justify-center gap-1\.5 mb-2">\s*<span class="text-\[24px\] font-black text-slate-800 tracking-tighter mt-4">VIP<\/span>\s*<span class="text-\[65px\] font-black text-orange-500 leading-\[0\.75\] tracking-tighter" style="text-shadow: 0 10px 20px rgba\(249,115,22,0\.2\);">(\d)<\/span>\s*<\/div>/g;

const replaceString = `<span class="text-[22px] font-black text-slate-800 tracking-widest leading-none">VIP</span>
                    <span class="text-[75px] font-black text-orange-500 leading-[0.85] tracking-tighter mt-[-4px]" style="text-shadow: 0 10px 20px rgba(249,115,22,0.3);">$1</span>`;

html = html.replace(searchRegex, replaceString);

// Also need to adjust spacing to ensure everything fits perfectly
html = html.replace(/w-\[45%\] pt-2/g, 'w-[45%] pt-1');
html = html.replace(/text-\[14px\] mt-1 text-center/g, 'text-[14px] mt-3 text-center');

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Text moved to head of number successfully');
