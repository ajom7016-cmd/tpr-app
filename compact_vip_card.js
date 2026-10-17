const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace Main Container Padding/Margin
content = content.replace('p-6 \nmb-8', 'p-5 mb-5');
content = content.replace('p-6 mb-8', 'p-5 mb-5'); // Catch both inline and wrapped

// Replace Top Row margin
content = content.replace('<div class="flex justify-between items-start mb-6">', '<div class="flex justify-between items-start mb-4">');

// Replace Middle Text margin
content = content.replace('<div class="mb-6">\n                            <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-1">VIP STATUS \nCARD</p>', '<div class="mb-4">\n                            <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-0.5">VIP STATUS \nCARD</p>');
content = content.replace('<div class="mb-6">\n                            <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-1">VIP STATUS CARD</p>', '<div class="mb-4">\n                            <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-0.5">VIP STATUS CARD</p>');

// Replace Progress Area padding/margin
content = content.replace('p-4 mb-5 shadow-inner', 'p-3.5 mb-4 shadow-inner');
content = content.replace('mb-3">\n                                <span id="task-progress-text"', 'mb-2.5">\n                                <span id="task-progress-text"');

fs.writeFileSync(file, content);
console.log('Successfully compacted the VIP card layout.');
