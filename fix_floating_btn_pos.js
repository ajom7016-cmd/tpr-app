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
    let modified = text.replace(/<div class="absolute z-\[100\]" style="top: 24px; left: 24px;">/g, '<div class="absolute z-[100] pl-1" style="top: 60px;">');
    if(text !== modified) {
        fs.writeFileSync(fp, modified);
        console.log('Fixed pos ' + fp);
    }
});
