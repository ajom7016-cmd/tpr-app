const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function pureCssStagger() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const pages = [
    '/var/www/jmj_app/public/glassmorphic_1/code.html',
    '/var/www/jmj_app/public/glassmorphic_2/code.html',
    '/var/www/jmj_app/public/investment_premium_glass/vip.html',
    '/var/www/jmj_app/public/user_profile_premium_glass/code.html',
    '/var/www/jmj_app/public/glassmorphic_3/code.html'
];
const advancedCss = '<style id="stagger-anim">\\n' +
'@keyframes popUpStagger {\\n' +
'    0% { opacity: 0; transform: translateY(30px) scale(0.96); }\\n' +
'    100% { opacity: 1; transform: translateY(0) scale(1); }\\n' +
'}\\n' +
'main > div:not(#tasks-container), #tasks-container > div, .glass-container, .bg-white\\\\\\\\/40 {\\n' +
'    animation: popUpStagger 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;\\n' +
'}\\n' +
'main > *:nth-child(1), #tasks-container > *:nth-child(1), *:nth-child(1) > .glass-container { animation-delay: 0.08s; }\\n' +
'main > *:nth-child(2), #tasks-container > *:nth-child(2), *:nth-child(2) > .glass-container { animation-delay: 0.15s; }\\n' +
'main > *:nth-child(3), #tasks-container > *:nth-child(3), *:nth-child(3) > .glass-container { animation-delay: 0.22s; }\\n' +
'main > *:nth-child(4), #tasks-container > *:nth-child(4), *:nth-child(4) > .glass-container { animation-delay: 0.29s; }\\n' +
'main > *:nth-child(5), #tasks-container > *:nth-child(5), *:nth-child(5) > .glass-container { animation-delay: 0.36s; }\\n' +
'main > *:nth-child(6), #tasks-container > *:nth-child(6), *:nth-child(6) > .glass-container { animation-delay: 0.43s; }\\n' +
'main > *:nth-child(7) { animation-delay: 0.50s; }\\n' +
'main > *:nth-child(8) { animation-delay: 0.57s; }\\n' +
'</style>';

for (let page of pages) {
    if (fs.existsSync(page)) {
        let content = fs.readFileSync(page, 'utf8');
        // Clean out ALL previous attempts
        content = content.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
        content = content.replace(/<script id="anim-script">[\\s\\S]*?<\\/script>/, '');
        
        content = content.replace('</head>', advancedCss + '\\n</head>');
        fs.writeFileSync(page, content);
    }
}

const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '8.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Pure CSS animation injected!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/pure_css_stagger.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/pure_css_stagger.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v105\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
pureCssStagger().catch(console.error);
