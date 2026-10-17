const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function injectBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

const auraHTML = \`
<div class="aura-bg absolute inset-0 overflow-hidden pointer-events-none z-[-1]" style="position: fixed; width: 100vw; height: 100vh; top: 0; left: 0;">
    <div style="position: absolute; top: 0%; right: 0%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 60%);"></div>
    <div style="position: absolute; bottom: 0%; left: 0%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,98,161,0.1) 0%, transparent 60%);"></div>
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; height: 500px; background: radial-gradient(circle, rgba(246,70,104,0.08) 0%, transparent 60%);"></div>
</div>
\`;

function injectInto(file) {
    let content = fs.readFileSync(file, 'utf8');
    // Don't inject twice
    if (!content.includes('aura-bg absolute inset-0')) {
        // Inject right after <body>
        content = content.replace(/<body[^>]*>/i, '$&\\n' + auraHTML);
        fs.writeFileSync(file, content);
        console.log('Injected aura into ' + file);
    }
}

injectInto('/var/www/jmj_app/public/user_profile_premium_glass/code.html');
injectInto('/var/www/jmj_app/public/investment_premium_glass/vip.html');
injectInto('/var/www/jmj_app/public/history_glass/code.html');
injectInto('/var/www/jmj_app/public/deposit_glass/code.html');
injectInto('/var/www/jmj_app/public/withdraw_glass/code.html');

// Cache bust
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/inject_bg.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/inject_bg.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
injectBg().catch(console.error);
