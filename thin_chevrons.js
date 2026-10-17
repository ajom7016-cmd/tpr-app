const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the HTML
content = content.replace(
    /<div id="nav-toggle"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<script>/,
    `<div id="nav-toggle" onclick="toggleBottomNav()" class="absolute bottom-[2px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer z-[200] pb-1 drop-shadow-sm" style="display: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
            <div id="chevron-container" class="flex flex-col items-center -space-y-5 transition-transform duration-300">
                <span class="material-symbols-outlined text-slate-800 opacity-40" style="font-size: 26px; font-variation-settings: 'wght' 200;">keyboard_arrow_up</span>
                <span class="material-symbols-outlined text-slate-800 opacity-70" style="font-size: 34px; font-variation-settings: 'wght' 300;">keyboard_arrow_up</span>
                <span class="material-symbols-outlined text-slate-800 opacity-100" style="font-size: 44px; font-variation-settings: 'wght' 400;">keyboard_arrow_up</span>
            </div>
        </div>
    </div>
</div>
<script>`
);

// Update JS styles for closed state
content = content.replace(/toggleBtn\.style\.bottom = '20px';/g, "toggleBtn.style.bottom = '2px';");
content = content.replace(/document\.getElementById\('nav-toggle'\)\.style\.bottom = '20px';/g, "document.getElementById('nav-toggle').style.bottom = '2px';");
content = content.replace(/toggleBtn\.style\.bottom = '95px';/g, "toggleBtn.style.bottom = '80px';");

fs.writeFileSync(file, content);
console.log('Made chevrons thinner and stick to bottom');
