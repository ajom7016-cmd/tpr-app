const fs = require('fs');
const path = require('path');
const files = [
    'public/user_profile_premium_glass/code.html',
    'public/profile_settings_glass/code.html',
    'public/bank_details_glass/code.html',
    'public/security_glass/code.html',
    'public/refer_glass/code.html',
    'public/security_devices/code.html',
    'public/security_change_password/code.html',
    'public/security_change_pin/code.html',
    'public/security_biometric/code.html',
    'public/security_deactivate/code.html'
];

files.forEach(fp => {
    if(!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf8');
    
    let targetPage = 'user_profile_premium_glass/code.html';
    if (fp.includes('user_profile')) targetPage = 'glassmorphic_1/code.html';
    else if (fp.includes('security_') && !fp.includes('security_glass')) targetPage = 'security_glass/code.html';
    else if (fp.includes('refer_glass')) targetPage = 'glassmorphic_1/code.html'; // refer goes to dashboard
    
    const btnHtml = `
    <!-- Floating Back Button -->
    <div class="absolute z-[100]" style="top: 24px; left: 24px;">
        <button class="text-slate-500 hover:text-slate-900 bg-white/70 hover:bg-white/95 backdrop-blur-xl rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-white/80 flex items-center p-2 transition-all duration-300 hover:scale-110 active:scale-95" onclick="window.parent.loadPage('${targetPage}', null)">
            <span class="material-symbols-outlined text-[20px] ml-[-2px]">arrow_back_ios_new</span>
        </button>
    </div>
`;
    // Remove old button logic (if we added left-6 z-[100] etc)
    text = text.replace(/<button class="absolute left-6 z-\[100\][\s\S]*?<\/button>/, '');
    text = text.replace(/<button class="header-btn"[\s\S]*?<\/button>/, '');
    
    if(text.includes('<!-- Floating Back Button -->')) {
        text = text.replace(/<!-- Floating Back Button -->[\s\S]*?<\/div>/, btnHtml.trim());
    } else {
        text = text.replace(/<body[^>]*>/, (match) => match + btnHtml);
    }
    
    fs.writeFileSync(fp, text);
    console.log('Fixed ' + fp);
});
