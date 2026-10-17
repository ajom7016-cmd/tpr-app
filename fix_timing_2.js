const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixStaggerTiming() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Instead of string literals with backticks, I will just write the file directly on the remote server
    const remoteScript = `
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
'        }, 40);\\n' + // wait 40ms for the iframe paint
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
const newVersion = '5.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Fixed Timing issues!');
`;

    let b64 = Buffer.from(remoteScript).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/remote_fix.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/remote_fix.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixStaggerTiming().catch(console.error);
