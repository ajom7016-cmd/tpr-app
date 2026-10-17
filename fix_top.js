const fs = require('fs');

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

    // Fix the button's top position so it's visible (60px)
    text = text.replace(/style="top: 24px;"/g, 'style="top: 60px;"');
    text = text.replace(/style="top: 24px; left: 20px;"/g, 'style="top: 60px; left: 20px;"');
    
    fs.writeFileSync(fp, text);
    console.log('Fixed button position for ' + fp);
});
