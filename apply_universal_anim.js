const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function applyUniversalAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

// 1. Remove iframe transitions from app.html to completely eliminate the 'hang'
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');

const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // ZERO DELAY SWAP. No iframe transitions to cause perceived 'hang'
            frame.style.transition = 'none';
            frame.src = finalUrl;
        } else {\`;
appHtml = appHtml.replace(oldLoadBlockRegex, newLoadBlock);

const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                // No iframe entrance transitions either. The pages handle their own animations now.
                this.style.transition = 'none';
                this.style.opacity = '1';
                this.style.transform = 'none';
            });\`;
appHtml = appHtml.replace(oldLoadListenerRegex, newLoadListener);
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '3.0.0';");
fs.writeFileSync(appFile, appHtml);

// 2. Inject CSS Staggered Cascade into ALL main pages
const cssToInject = \`
<style>
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(20px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
body > div, main > div, .grid > div {
    animation: popUpStagger 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
}
div:nth-child(1) { animation-delay: 0.03s; }
div:nth-child(2) { animation-delay: 0.08s; }
div:nth-child(3) { animation-delay: 0.13s; }
div:nth-child(4) { animation-delay: 0.18s; }
div:nth-child(5) { animation-delay: 0.23s; }
div:nth-child(6) { animation-delay: 0.28s; }
div:nth-child(7) { animation-delay: 0.33s; }
div:nth-child(8) { animation-delay: 0.38s; }
</style>
\`;

const pages = [
    '/var/www/jmj_app/public/glassmorphic_1/code.html',
    '/var/www/jmj_app/public/investment_premium_glass/vip.html',
    '/var/www/jmj_app/public/user_profile_premium_glass/code.html',
    '/var/www/jmj_app/public/history_glass/code.html'
];

for (let page of pages) {
    if (fs.existsSync(page)) {
        let content = fs.readFileSync(page, 'utf8');
        // Remove existing popUpStagger if any
        content = content.replace(/<style>[\\s\\S]*?popUpStagger[\\s\\S]*?<\\/style>/, '');
        // Inject before </head>
        content = content.replace('</head>', cssToInject + '\\n</head>');
        fs.writeFileSync(page, content);
    }
}

console.log('Universal cascading animation applied and iframe delays removed!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/apply_universal_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/apply_universal_anim.js');
    console.log(res.stdout);
    
    // Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v72\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
applyUniversalAnim().catch(console.error);
