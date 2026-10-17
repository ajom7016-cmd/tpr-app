const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Revert the dots to their original orange color
content = content.replace(/<div class="w-2\.5 h-2\.5 rounded-full shadow-\[0_0_12px_rgba\(255,94,0,1\)\] border border-white\/30" style="background: linear-gradient\(180deg, #ffc57a 0%, #ff5e00 100%\);"><\/div>/g, '<div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>');
// Just in case the previous replacement failed and it's still the first gradient:
content = content.replace(/<div class="w-2 h-2 rounded-full shadow-\[0_0_8px_rgba\(255,94,0,0\.6\)\]" style="background: linear-gradient\(180deg, #ff9a28 0%, #ff5e00 100%\);"><\/div>/g, '<div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>');

// 2. Change the Start button's inline style to use the original dot color (#f97316 = Tailwind's orange-500)
// Old: style="background: linear-gradient(180deg, #ff9a28 0%, #ff5e00 100%); box-shadow: 0 4px 15px rgba(255, 94, 0, 0.4);"
// New: style="background: #f97316; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);"
content = content.replace(/style="background: linear-gradient\(180deg, #ff9a28 0%, #ff5e00 100%\); box-shadow: 0 4px 15px rgba\(255, 94, 0, 0\.4\);"/g, 'style="background: #f97316; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);"');

fs.writeFileSync(file, content);
console.log('Successfully reverted dots and updated start button color.');
