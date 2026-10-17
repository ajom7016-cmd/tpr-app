const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Container padding: p-5 -> p-4, mb-5 -> mb-4
content = content.replace(/p-5\s*mb-5/g, 'p-4 mb-4');

// Top row: mb-4 -> mb-3
content = content.replace(/justify-between items-start mb-4/g, 'justify-between items-start mb-3');

// Middle text: mb-6 -> mb-3, and VIP STATUS CARD subtitle margin mb-1 -> mb-0
content = content.replace(/<div class="mb-6">\s*<p class="text-white\/70 text-\[11px\] font-black tracking-\[0\.2em\] uppercase mb-1">VIP STATUS CARD<\/p>/g, '<div class="mb-3">\n                            <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-0.5">VIP STATUS CARD</p>');

// Also change the title text size from 42px to 38px so it takes slightly less space vertically
content = content.replace(/text-\[42px\]/g, 'text-[36px]');

// Progress Area: p-3.5 mb-4 -> p-3 mb-3
content = content.replace(/p-3\.5 mb-4/g, 'p-3 mb-3');

// Progress inner margin: mb-3 -> mb-2
content = content.replace(/gap-2 mb-3/g, 'gap-2 mb-2');

// Reduce border radius slightly to match the smaller padding (32px to 28px)
content = content.replace(/rounded-\[32px\]/g, 'rounded-[28px]');

fs.writeFileSync(file, content);
console.log('Successfully applied extra compact spacing to the VIP card.');
