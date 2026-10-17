const fs = require('fs');
const path = require('path');

const mappings = {
    'public/user_profile_premium_glass/code.html': 'glassmorphic_1/code.html',
    'public/profile_settings_glass/code.html': 'user_profile_premium_glass/code.html',
    'public/bank_details_glass/code.html': 'user_profile_premium_glass/code.html',
    'public/glassmorphic_3/code.html': 'user_profile_premium_glass/code.html',
    'public/security_glass/code.html': 'user_profile_premium_glass/code.html',
    'public/refer_glass/code.html': 'glassmorphic_1/code.html',
    'public/security_devices/code.html': 'security_glass/code.html',
    'public/security_change_password/code.html': 'security_glass/code.html',
    'public/security_change_pin/code.html': 'security_glass/code.html',
    'public/security_biometric/code.html': 'security_glass/code.html',
    'public/security_deactivate/code.html': 'security_glass/code.html',
    'public/security_2fa/code.html': 'security_glass/code.html'
};

for (const [fp, target] of Object.entries(mappings)) {
    if (!fs.existsSync(fp)) continue;
    let text = fs.readFileSync(fp, 'utf8');

    // 1. Completely remove ALL previous back buttons we injected
    text = text.replace(/<!-- Floating Back Button -->[\s\S]*?<\/div>/g, '');
    text = text.replace(/<div class="fixed z-\[9999\]"[\s\S]*?<\/div>/g, '');
    text = text.replace(/<div class="absolute z-\[100\][^>]*>[\s\S]*?<\/div>/g, '');
    text = text.replace(/<!-- True Floating Back Button.*-->[\s\S]*?<\/div>/g, '');
    
    // Also remove the button if it's sitting naked in a flex header
    text = text.replace(/<button class="text-slate-500 hover:text-slate-900 bg-white\/70 hover:bg-white\/95 backdrop-blur-xl rounded-full shadow-\[0_4px_15px_rgba\(0,0,0,0\.08\)\] border border-white\/80 flex items-center justify-center w-10 h-10 transition-all duration-300 hover:scale-110 active:scale-95"[^>]*>[\s\S]*?<\/button>/g, '');
    // Also remove old header-btn
    text = text.replace(/<button class="header-btn"[^>]*>[\s\S]*?<\/button>/g, '');

    // 2. The EXACT floating button they want, FIXED so it never scrolls away, TOP 20px so it clears headers
    const newBtn = `
    <!-- True Floating Back Button (Never Scrolls, Never inside Header) -->
    <div class="fixed z-[9999]" style="top: 20px; left: 16px;">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center justify-center w-10 h-10 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('${target}', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>
    `;

    // 3. Inject it immediately after <body ...>
    text = text.replace(/(<body[^>]*>)/, '$1\n' + newBtn);

    fs.writeFileSync(fp, text);
    console.log('Fixed absolutely for ' + fp);
}
