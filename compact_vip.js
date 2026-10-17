const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace top row margin
content = content.replace(/<!-- Top Row -->\s*<div class="flex justify-between items-center mb-3">/, '<!-- Top Row -->\n                        <div class="flex justify-between items-center mb-1">');

// Replace middle text margin
content = content.replace(/<!-- Middle Text -->\s*<div class="mb-3">/, '<!-- Middle Text -->\n                        <div class="mb-2">');

// Update top and bottom padding of the card if not already done enough
// Wait, I changed it to px-4 pt-3 pb-3. Let's make it tighter: px-4 pt-2.5 pb-2.5
content = content.replace(/rounded-\[28px\] px-4 pt-3 pb-3 mb-4/, 'rounded-[28px] px-4 pt-2.5 pb-2.5 mb-4');

// Reduce spacing between title and subtitle
content = content.replace(/<p class="text-white\/70 text-\[11px\] font-black tracking-\[0\.2em\] uppercase mb-0\.5">VIP STATUS CARD<\/p>/, '<p class="text-white/70 text-[10px] font-black tracking-[0.2em] uppercase mb-0">VIP STATUS CARD</p>');

fs.writeFileSync(file, content);
console.log('Successfully made the card ultra-compact!');
