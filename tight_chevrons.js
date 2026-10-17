const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the HTML
content = content.replace(
    /<div id="chevron-container"[\s\S]*?<\/div>/,
    `<div id="chevron-container" class="flex flex-col items-center transition-transform duration-300 pt-2 pb-4">
                <span class="material-symbols-outlined text-slate-800 opacity-40" style="font-size: 26px; font-variation-settings: 'wght' 200; line-height: 0.3;">keyboard_arrow_up</span>
                <span class="material-symbols-outlined text-slate-800 opacity-70" style="font-size: 34px; font-variation-settings: 'wght' 300; line-height: 0.3;">keyboard_arrow_up</span>
                <span class="material-symbols-outlined text-slate-800 opacity-100" style="font-size: 44px; font-variation-settings: 'wght' 400; line-height: 0.3;">keyboard_arrow_up</span>
            </div>`
);

fs.writeFileSync(file, content);
console.log('Made chevrons stick closely together using line-height');
