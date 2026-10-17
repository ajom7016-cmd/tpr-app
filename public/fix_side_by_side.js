const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Replace the stacked layout back to side-by-side
const searchRegex = /<div class="flex flex-col items-center justify-center w-\[45%\] pt-1">\s*<span class="text-\[26px\] font-black text-slate-800 tracking-widest leading-none mb-2">VIP<\/span>\s*<span class="text-\[75px\] font-black text-(red|orange)-500 leading-\[0\.75\] tracking-tighter" style="text-shadow: 0 10px 20px rgba\(\d+,\d+,\d+,0\.2\);">(\d)<\/span>\s*<span class="text-(red|orange)-600 font-bold text-\[14px\] mt-4 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-\[11px\]">(\d+ Days)<\/span><\/span>\s*<\/div>/g;

const replaceString = `<div class="flex flex-col items-center justify-center w-[45%] pt-2">
                    <div class="flex items-center justify-center gap-1.5 mb-2">
                        <span class="text-[24px] font-black text-slate-800 tracking-tighter mt-4">VIP</span>
                        <span class="text-[65px] font-black text-orange-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(249,115,22,0.2);">$2</span>
                    </div>
                    <span class="text-red-600 font-bold text-[14px] mt-1 text-center leading-tight">Capital Return<br><span class="text-slate-500 font-medium text-[11px]">$4</span></span>
                </div>`;

html = html.replace(searchRegex, replaceString);

// Fix VIP 3's Capital return text which should be orange
html = html.replace(
    /<div class="flex items-center justify-center gap-1\.5 mb-2">\s*<span class="text-\[24px\] font-black text-slate-800 tracking-tighter mt-4">VIP<\/span>\s*<span class="text-\[65px\] font-black text-orange-500 leading-\[0\.75\] tracking-tighter" style="text-shadow: 0 10px 20px rgba\(249,115,22,0\.2\);">3<\/span>\s*<\/div>\s*<span class="text-red-600 font-bold text-\[14px\] mt-1 text-center leading-tight">Capital Return/g,
    `<div class="flex items-center justify-center gap-1.5 mb-2">
                        <span class="text-[24px] font-black text-slate-800 tracking-tighter mt-4">VIP</span>
                        <span class="text-[65px] font-black text-orange-500 leading-[0.75] tracking-tighter" style="text-shadow: 0 10px 20px rgba(249,115,22,0.2);">3</span>
                    </div>
                    <span class="text-amber-600 font-bold text-[14px] mt-1 text-center leading-tight">Capital Return`
);


fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Text perfectly aligned side by side successfully');
