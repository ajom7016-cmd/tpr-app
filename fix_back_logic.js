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
    'public/security_deactivate/code.html': 'security_glass/code.html'
};

for (const [fp, target] of Object.entries(mappings)) {
    if (!fs.existsSync(fp)) continue;
    let text = fs.readFileSync(fp, 'utf8');

    // 1. Remove the floating absolute button we added at the body level
    text = text.replace(/<!-- Floating Back Button -->[\s\S]*?<\/div>/g, '');
    
    // The button design without absolute:
    const newBtn = `<button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center justify-center w-10 h-10 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('${target}', null)">
        <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
    </button>`;
    
    // For user_profile_premium_glass, it has NO header, so we DO need absolute!
    const absoluteBtn = `<div class="absolute z-[100] left-6" style="top: 24px;">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center justify-center w-10 h-10 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('${target}', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>`;

    if (fp.includes('user_profile_premium_glass')) {
        text = text.replace(/<body[^>]*>/, (match) => match + '\n' + absoluteBtn);
    } else {
        // Find the header div: `<div class="px-6... flex items-center...`
        // Or for security_devices: `<div class="px-6... grid ...`
        // We will just inject it into the header where the old button was, OR if it's missing, inject absolute
        
        // Let's find the FIRST div after body that has 'px-6' and 'flex' or 'grid'
        let hasHeader = false;
        
        // If it's glassmorphic_3, we know it has `<div class="tabs-container...` as the first thing. So let's just use absolute top-6 left-6 for it.
        if (fp.includes('glassmorphic_3')) {
            text = text.replace(/<body[^>]*>/, (match) => match + '\n' + absoluteBtn);
            hasHeader = true;
        } else {
            // Replace the empty or existing header button
            // If the header has an empty <div> for the left col (because we removed it), we find it
            text = text.replace(/<button class="header-btn"[^>]*>[\s\S]*?<\/button>/, newBtn);
            // Some files might have `<div class="w-10 h-10"></div>` or nothing?
            // Actually, in the previous script I removed `<button class="header-btn"`. So the header might just be `<h1>...</h1>`.
            // Let's find `px-6 mb-` and inject the button before `<h1>`
            if (text.includes('<h1 class="text-[20px]')) {
                // If it doesn't already have our button
                if (!text.includes('w-10 h-10 transition-all')) {
                    text = text.replace(/(<h1 class="text-\[20px\][^>]*>)/, newBtn + '\n          $1');
                }
            } else {
                // Fallback to absolute
                text = text.replace(/<body[^>]*>/, (match) => match + '\n' + absoluteBtn);
            }
        }
    }
    
    fs.writeFileSync(fp, text);
    console.log('Fixed routing and UI for ' + fp);
}
