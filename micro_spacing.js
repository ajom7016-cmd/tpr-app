const fs = require('fs');
let f = 'public/deposit_glass/code.html';
let content = fs.readFileSync(f, 'utf8');

// Reduce top padding from 82px to 81px (1px gap below 80px header)
content = content.replace(/pt-\[82px\]/g, 'pt-[81px]');

// Move back button left by 4px: replace pl-1 (4px padding) with -ml-1 (-4px margin) or just remove pl-1 and add -ml-1
content = content.replace('mb-1 pl-1 flex-none', 'mb-1 -ml-1 flex-none');

fs.writeFileSync(f, content);
console.log('Fixed micro spacing (1px top gap, moved back button left)');
