const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreVipAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

const universalCss = '<style id="stagger-anim">\\n' +
'@keyframes popUpStagger {\\n' +
'    0% { opacity: 0; transform: translateY(30px) scale(0.96); }\\n' +
'    100% { opacity: 1; transform: translateY(0) scale(1); }\\n' +
'}\\n' +
'.stagger-root > div, .stagger-root > section, .stagger-root > a {\\n' +
'    animation: popUpStagger 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both !important;\\n' +
'}\\n' +
'.stagger-root > *:nth-child(1) { animation-delay: 0.08s !important; }\\n' +
'.stagger-root > *:nth-child(2) { animation-delay: 0.15s !important; }\\n' +
'.stagger-root > *:nth-child(3) { animation-delay: 0.22s !important; }\\n' +
'.stagger-root > *:nth-child(4) { animation-delay: 0.29s !important; }\\n' +
'.stagger-root > *:nth-child(5) { animation-delay: 0.36s !important; }\\n' +
'.stagger-root > *:nth-child(6) { animation-delay: 0.43s !important; }\\n' +
'.stagger-root > *:nth-child(7) { animation-delay: 0.50s !important; }\\n' +
'.stagger-root > *:nth-child(8) { animation-delay: 0.57s !important; }\\n' +
'.stagger-root > *:nth-child(9) { animation-delay: 0.64s !important; }\\n' +
'.stagger-root > *:nth-child(10) { animation-delay: 0.71s !important; }\\n' +
'</style>';

// Fix VIP
let vipFile = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let vip = fs.readFileSync(vipFile, 'utf8');

// 1. Re-add stagger-root
if (!vip.includes('stagger-root')) {
    vip = vip.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');
}

// 2. Re-inject CSS
if (!vip.includes('popUpStagger')) {
    vip = vip.replace('</head>', universalCss + '\\n</head>');
}

fs.writeFileSync(vipFile, vip);

// Cache Busting
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '20.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Restored animation to VIP page!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_vip_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_vip_anim.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v165\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
restoreVipAnimation().catch(console.error);
