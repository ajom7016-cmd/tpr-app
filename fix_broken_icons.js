const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the font URL
content = content.replace(/<link href="https:\/\/fonts.googleapis.com\/css2\?family=Material.*?Outlined:wght,FILL,GRAD,opsz@400,0,0,24" rel="stylesheet"\/>/, 
    '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24" rel="stylesheet"/>');

// 2. Fix the font-variation-settings
content = content.replace(/style="font-variation-settings: 'wght'[^;]*;"/g, `style="font-variation-settings: 'wght' 300;"`);

// 3. Fix the weird percentage texts
content = content.replace(/\+.*?5\.8%/g, '+ 5.8%');
content = content.replace(/\+.*?7\.2%/g, '+ 7.2%');
content = content.replace(/\+.*?4\.1%/g, '+ 4.1%');

// 4. Fix the Total Earnings text (it had a weird Taka symbol)
content = content.replace(/<h3 class="text-\[18px\] font-black text-slate-900 mb-1">.*<span id="user-total-earnings">/, 
    '<h3 class="text-[18px] font-black text-slate-900 mb-1">৳ <span id="user-total-earnings">');

content = content.replace(/<h3 class="text-\[18px\] font-black text-slate-900 mb-1">.*<span id="user-invested">/, 
    '<h3 class="text-[18px] font-black text-slate-900 mb-1">৳ <span id="user-invested">');

// 5. Fix any other stray '৳' that broke
content = content.replace(/৳ /g, '৳ ');

fs.writeFileSync(file, content);
console.log('Fixed broken HTML icons and symbols');
