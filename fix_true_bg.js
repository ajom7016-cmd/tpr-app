const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixTrueBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

const realBgStyle = \`
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
\`;

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the fake aura I injected earlier
    content = content.replace(/<div class="aura-bg[^>]*>[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>/, ''); // Oops, regex might be tricky. Let's just remove the style
    
    // Actually, let's just remove the <div class="aura-bg absolute inset-0 overflow-hidden pointer-events-none z-\\[-1\\]"[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>
    content = content.replace(/<div class="aura-bg absolute inset-0[^>]*>[\\s\\S]*?<div style="position: absolute; top: 50%;[^>]*><\\/div>\\s*<\\/div>/, '');

    // Add the true background
    if (!content.includes('id="true-bg"')) {
        content = content.replace('</head>', realBgStyle + '\\n</head>');
    }
    
    fs.writeFileSync(file, content);
}

fixFile('/var/www/jmj_app/public/user_profile_premium_glass/code.html');
fixFile('/var/www/jmj_app/public/investment_premium_glass/vip.html');
fixFile('/var/www/jmj_app/public/glassmorphic_2/code.html');
fixFile('/var/www/jmj_app/public/history_glass/code.html');
fixFile('/var/www/jmj_app/public/deposit_glass/code.html');
fixFile('/var/www/jmj_app/public/withdraw_glass/code.html');

// Cache bust
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

console.log('Applied true background to all sub-pages!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_true_bg.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_true_bg.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixTrueBg().catch(console.error);
