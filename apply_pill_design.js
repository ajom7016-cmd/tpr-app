const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the HTML for nav-toggle
content = content.replace(
    /<div id="nav-toggle"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<script>/,
    `<div id="nav-toggle" onclick="toggleBottomNav()" class="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer z-[200]" style="display: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
            <div class="px-7 py-3 rounded-full bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <span class="font-black text-[14px] text-slate-800 tracking-widest uppercase">Menu</span>
                <div id="chevron-container" class="transition-transform duration-300 flex items-center justify-center">
                    <span class="material-symbols-outlined text-slate-800" style="font-size: 20px; font-variation-settings: 'wght' 600;">arrow_upward</span>
                </div>
            </div>
        </div>
    </div>
</div>
<script>`
);

// We need to restore the JS style logic so it doesn't drop to 2px at the bottom.
content = content.replace(/toggleBtn\.style\.bottom = '2px';/g, "toggleBtn.style.bottom = '20px';");
content = content.replace(/document\.getElementById\('nav-toggle'\)\.style\.bottom = '2px';/g, "document.getElementById('nav-toggle').style.bottom = '20px';");
content = content.replace(/toggleBtn\.style\.bottom = '80px';/g, "toggleBtn.style.bottom = '95px';");

fs.writeFileSync(file, content);
console.log('Applied the Premium Pill design to the toggle button');
