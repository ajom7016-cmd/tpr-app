const fs = require('fs');

let html = fs.readFileSync('investment_premium_glass/vip.html', 'utf8');

// Revert the `pt-2` on the row wrapper
html = html.replace(/<div class="flex justify-between items-start mb-6 relative z-10 pt-2">/g, '<div class="flex justify-between items-start mb-6 relative z-10">');
// Revert the `pt-4` for VIP 3
html = html.replace(/<div class="flex justify-between items-start mb-6 relative z-10 pt-4">/g, '<div class="flex justify-between items-start mb-6 relative z-10">');

// Revert the margin spacing and position the badge higher so it doesn't overlap
html = html.replace(/<div class="absolute -top-4 bg-gradient-to-br from-slate-800 to-slate-900 (.*?)"(.*?)>VIP<\/div>\s*<span class="glowing-number mt-2">(.*?)<\/span>\s*<span class="text-red-600 font-bold text-\[13px\] mt-4 text-center leading-tight">/g, 
`<div class="absolute -top-6 bg-gradient-to-br from-slate-800 to-slate-900 $1"$2>VIP</div>
                    <span class="glowing-number mt-2">$3</span>
                    <span class="text-red-600 font-bold text-[13px] mt-5 text-center leading-tight">`);

html = html.replace(/<div class="absolute -top-4 bg-gradient-to-br from-yellow-500 to-amber-600 (.*?)"(.*?)>VIP<\/div>\s*<span class="glowing-number glowing-number-gold mt-2">(.*?)<\/span>\s*<span class="text-amber-600 font-bold text-\[13px\] mt-4 text-center leading-tight">/g, 
`<div class="absolute -top-6 bg-gradient-to-br from-yellow-500 to-amber-600 $1"$2>VIP</div>
                    <span class="glowing-number glowing-number-gold mt-2">$3</span>
                    <span class="text-amber-600 font-bold text-[13px] mt-5 text-center leading-tight">`);

fs.writeFileSync('investment_premium_glass/vip.html', html, 'utf8');
console.log('VIP Badge fixed');
