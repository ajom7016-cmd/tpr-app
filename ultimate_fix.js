const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function ultimateFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Upload pristine original HTML files from local backup
    const pages = [
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_1/code.html', remote: '/var/www/jmj_app/public/glassmorphic_1/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_2/code.html', remote: '/var/www/jmj_app/public/glassmorphic_2/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', remote: '/var/www/jmj_app/public/investment_premium_glass/vip.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/user_profile_premium_glass/code.html', remote: '/var/www/jmj_app/public/user_profile_premium_glass/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_3/code.html', remote: '/var/www/jmj_app/public/glassmorphic_3/code.html' }
    ];
    
    for (const page of pages) {
        await ssh.putFile(page.local, page.remote);
        console.log('Restored pristine backup for', page.remote);
    }
    
    // 2. Safely apply the precise CSS to prevent double animation and preserve original CSS
    const safeScript = `
const fs = require('fs');
const pages = [
    '/var/www/jmj_app/public/glassmorphic_1/code.html',
    '/var/www/jmj_app/public/glassmorphic_2/code.html',
    '/var/www/jmj_app/public/investment_premium_glass/vip.html',
    '/var/www/jmj_app/public/user_profile_premium_glass/code.html',
    '/var/www/jmj_app/public/glassmorphic_3/code.html'
];
const generalCss = \`
<style id="stagger-anim">
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
main > div:not(#tasks-container), #tasks-container > div, .glass-container, .bg-white\\\\/40 {
    animation: popUpStagger 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
}
main > *:nth-child(1), #tasks-container > *:nth-child(1) { animation-delay: 0.04s; }
main > *:nth-child(2), #tasks-container > *:nth-child(2) { animation-delay: 0.10s; }
main > *:nth-child(3), #tasks-container > *:nth-child(3) { animation-delay: 0.16s; }
main > *:nth-child(4), #tasks-container > *:nth-child(4) { animation-delay: 0.22s; }
main > *:nth-child(5), #tasks-container > *:nth-child(5) { animation-delay: 0.28s; }
main > *:nth-child(6), #tasks-container > *:nth-child(6) { animation-delay: 0.34s; }
</style>
\`;

for (let page of pages) {
    let content = fs.readFileSync(page, 'utf8');
    content = content.replace('</head>', generalCss + '\\n</head>');
    fs.writeFileSync(page, content);
}

// 3. Force Cache Busting in app.html so browsers instantly discard the broken cached files
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
// Generate a unique version timestamp to completely bust all caches
const newVersion = '4.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");

// Make sure iframe transition is set to ZERO DELAY swap (no native hang)
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            frame.style.transition = 'none';
            frame.src = finalUrl;
        } else {\`;
appHtml = appHtml.replace(oldLoadBlockRegex, newLoadBlock);
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                this.style.transition = 'none';
                this.style.opacity = '1';
                this.style.transform = 'none';
            });\`;
appHtml = appHtml.replace(oldLoadListenerRegex, newLoadListener);
fs.writeFileSync(appFile, appHtml);

console.log('Ultimate Fix Applied! Cache busted to v: ' + newVersion);
    `;
    
    let b64 = Buffer.from(safeScript).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/ultimate_fix.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/ultimate_fix.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v90\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
ultimateFix().catch(console.error);
