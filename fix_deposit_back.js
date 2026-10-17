const fs = require('fs');

let file = 'public/deposit_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldButtonRegex = /<!-- Header \/ Back -->\s*<div id="global-back-btn" class="mb-1 -ml-2 flex-none">\s*<button class="text-slate-600 bg-white\/50 backdrop-blur-md rounded-full border border-white\/60 flex items-center p-2" onclick="window\.parent\.loadPage\('glassmorphic_1\/code\.html', null\)">\s*<span class="material-symbols-outlined text-\[20px\] ml-\[-2px\]">arrow_back_ios_new<\/span>\s*<\/button>\s*<\/div>/;

const newButton = `<!-- Header / Back -->
    <div id="global-back-btn" class="mb-4 mt-2 ml-2 flex-none relative z-50">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center p-2 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('glassmorphic_1/code.html', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>`;

if (content.match(oldButtonRegex)) {
    content = content.replace(oldButtonRegex, newButton);
    fs.writeFileSync(file, content);
    console.log('Fixed deposit_glass back button');
} else {
    console.log('Could not match deposit_glass back button');
}
