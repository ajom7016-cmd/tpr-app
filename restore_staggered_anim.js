const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreStaggeredAnim() {
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
'    opacity: 0;\\n' +
'}\\n' +
'.trigger-anim > div:not(#tasks-container), #tasks-container.trigger-anim > div, .trigger-anim.glass-container, .trigger-anim .glass-container, .trigger-anim .bg-white\\\\\\\\/40 {\\n' +
'    animation: popUpStagger 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;\\n' +
'}\\n' +
'.trigger-anim > *:nth-child(1), #tasks-container.trigger-anim > *:nth-child(1), .trigger-anim *:nth-child(1) { animation-delay: 0.05s; }\\n' +
'.trigger-anim > *:nth-child(2), #tasks-container.trigger-anim > *:nth-child(2), .trigger-anim *:nth-child(2) { animation-delay: 0.12s; }\\n' +
'.trigger-anim > *:nth-child(3), #tasks-container.trigger-anim > *:nth-child(3), .trigger-anim *:nth-child(3) { animation-delay: 0.19s; }\\n' +
'.trigger-anim > *:nth-child(4), #tasks-container.trigger-anim > *:nth-child(4), .trigger-anim *:nth-child(4) { animation-delay: 0.26s; }\\n' +
'.trigger-anim > *:nth-child(5), #tasks-container.trigger-anim > *:nth-child(5), .trigger-anim *:nth-child(5) { animation-delay: 0.33s; }\\n' +
'.trigger-anim > *:nth-child(6), #tasks-container.trigger-anim > *:nth-child(6), .trigger-anim *:nth-child(6) { animation-delay: 0.40s; }\\n' +
'.trigger-anim > *:nth-child(7) { animation-delay: 0.47s; }\\n' +
'.trigger-anim > *:nth-child(8) { animation-delay: 0.54s; }\\n' +
'</style>\\n' +
'<script id="anim-script">\\n' +
'    window.addEventListener("DOMContentLoaded", () => {\\n' +
'        setTimeout(() => {\\n' +
'            const m = document.querySelector("main");\\n' +
'            if(m) m.classList.add("trigger-anim");\\n' +
'            const tc = document.getElementById("tasks-container");\\n' +
'            if(tc) tc.classList.add("trigger-anim");\\n' +
'        }, 40);\\n' + 
'    });\\n' +
'</script>';

for (let page of pages) {
    if (fs.existsSync(page)) {
        let content = fs.readFileSync(page, 'utf8');
        content = content.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
        content = content.replace(/<script id="anim-script">[\\s\\S]*?<\\/script>/, '');
        content = content.replace('</head>', advancedCss + '\\n</head>');
        fs.writeFileSync(page, content);
    }
}

const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');

// REMOVE Apple Animation from app.html and make it instant 0ms swap
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

// Cache Busting
const newVersion = '7.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");

fs.writeFileSync(appFile, appHtml);

console.log('Restored Staggered Animation properly!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_staggered.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_staggered.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v100\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
restoreStaggeredAnim().catch(console.error);
