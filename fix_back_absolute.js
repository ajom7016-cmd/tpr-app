const fs = require('fs');
const path = require('path');

const files = [
    'public/user_profile_premium_glass/code.html',
    'public/profile_settings_glass/code.html',
    'public/bank_details_glass/code.html',
    'public/glassmorphic_3/code.html',
    'public/security_glass/code.html',
    'public/refer_glass/code.html',
    'public/security_devices/code.html',
    'public/security_change_password/code.html',
    'public/security_change_pin/code.html',
    'public/security_biometric/code.html',
    'public/security_deactivate/code.html',
    'public/security_2fa/code.html'
];

files.forEach(fp => {
    if(!fs.existsSync(fp)) return;
    let text = fs.readFileSync(fp, 'utf8');

    // 1. Revert `fixed` to `absolute` because he wants it to scroll away with the page (like a normal element).
    // The previous script wrote: `absolute z-50 pl-1 style="top: 24px;"`
    // Let's make sure it's `absolute`.
    text = text.replace(/<div class="(fixed|absolute) z-50 pl-1" style="top: 24px;">/g, '<div class="absolute z-50 pl-1" style="top: 24px; left: 24px;">');

    // 2. Fix the header overlap!
    // In pages like profile_settings_glass/code.html, we have `<div class="px-6 mb-8 flex items-center relative z-10">` which is the header.
    // If the back button is absolute at top: 24px, and the header is also near the top, they overlap.
    // We need to add padding-top to the header, OR change the back button to be relatively positioned IN the header, but he said "heder ar vitore abar dukaisis" (you put it inside the header again).
    // So he DOES NOT want it in the header. He wants it floating, absolute, but pushing the content down so it doesn't overlap.
    // Wait, in his screenshot of 2FA, the button is on the top-left, and the text "Two-Factor Auth" is centered.
    // If we make it `absolute`, `top: 24px`, `left: 24px`, it sits in the top left.
    // To prevent it overlapping the title, the title should just be centered in its own div.
    
    // Let's just make sure we are doing EXACTLY what he asked:
    // 1. absolute (so it scrolls)
    // 2. top: 24px, left: 24px
    text = text.replace(/<div class="(fixed|absolute) z-50 pl-1" style="top: (60px|24px);">/g, '<div class="absolute z-50 pl-1" style="top: 24px; left: 20px;">');
    
    // For support page, it's `top: 60px` because the header is huge?
    // Let's just set them all to top: 24px, left: 20px, absolute.
    
    fs.writeFileSync(fp, text);
    console.log('Fixed absolute for ' + fp);
});
