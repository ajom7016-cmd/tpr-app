const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

const searchRegex = /<div class="flex items-baseline justify-center">\s*<span class="text-\[24px\] font-black text-slate-800 tracking-wider mr-1\.5">VIP<\/span>\s*<span class="text-\[65px\] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 leading-none drop-shadow-md" style="line-height: 0\.85;">(\d)<\/span>\s*<\/div>/g;

const replaceString = `<span class="text-[26px] font-black text-slate-800 tracking-widest leading-none mb-0 z-10 relative">VIP</span>
                    <span class="text-[75px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-md tracking-tighter mt-[-8px] relative z-0" style="line-height: 0.85;">$1</span>`;

html = html.replace(searchRegex, replaceString);

// Also add a little padding-top to the container so it doesn't touch the top edge
html = html.replace(/<div class="flex flex-col items-center justify-center w-\[45%\]">/g, '<div class="flex flex-col items-center justify-center w-[45%] pt-1">');

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Text moved perfectly to top of number');
