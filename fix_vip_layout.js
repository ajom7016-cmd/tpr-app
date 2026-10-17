const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixVipLayout() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

const missingHTML = \`
    <!-- Premium Animated Background Light -->
    <div class="bg-3d">
        <div class="orb-1"></div>
        <div class="orb-2"></div>
        <div class="bg-block-1"></div>
        <div class="bg-block-2"></div>
    </div>
    
    <div class="px-6 pb-2">
        <h1 class="text-[20px] font-black text-slate-900 leading-tight">Upgrade to Premium VIP</h1>
    </div>

    <div class="px-5 mt-4 space-y-12 stagger-root">
\`;

let file = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// If the wrapper is missing (i.e. 'Upgrade to Premium VIP' is not there)
if (!content.includes('Upgrade to Premium VIP')) {
    content = content.replace(/<body[^>]*>\\s*(<!--[^>]*-->)?/, '<body class="pb-6">\\n' + missingHTML);
    
    // We also need to add a closing </div> for the missing wrapper at the end of the body
    content = content.replace(/<\\/body>/, '</div>\\n</body>');
    
    fs.writeFileSync(file, content);
    console.log('Restored missing HTML wrappers to vip.html!');
} else {
    // If it's there but missing space-y-12 or stagger-root
    if (content.includes('<div class="px-5 mt-4 space-y-12">')) {
        content = content.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');
        fs.writeFileSync(file, content);
        console.log('Added stagger-root to existing wrapper.');
    } else {
        console.log('Wrapper seems to be present but structure is unrecognized.');
    }
}

// Cache bust
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_vip_layout.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_vip_layout.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixVipLayout().catch(console.error);
