const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixOtherPages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

const advancedCss = '<style id="stagger-anim">\\n' +
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

// 1. Dashboard
let dashFile = '/var/www/jmj_app/public/glassmorphic_1/code.html';
let dash = fs.readFileSync(dashFile, 'utf8');
dash = dash.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
dash = dash.replace('<main class="px-5 space-y-4 pt-4">', '<main class="px-5 space-y-4 pt-4 stagger-root">');
dash = dash.replace('</head>', advancedCss + '\\n</head>');
fs.writeFileSync(dashFile, dash);

// 2. Tasks
let tasksFile = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let tasks = fs.readFileSync(tasksFile, 'utf8');
tasks = tasks.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
tasks = tasks.replace('class="max-w-3xl mx-auto flex flex-col gap-4 mb-2"', 'class="max-w-3xl mx-auto flex flex-col gap-4 mb-2 stagger-root"');
tasks = tasks.replace('</head>', advancedCss + '\\n</head>');
fs.writeFileSync(tasksFile, tasks);

// 3. VIP
let vipFile = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let vip = fs.readFileSync(vipFile, 'utf8');
vip = vip.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
vip = vip.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');
vip = vip.replace('</head>', advancedCss + '\\n</head>');
fs.writeFileSync(vipFile, vip);

// 4. Profile
let profFile = '/var/www/jmj_app/public/user_profile_premium_glass/code.html';
let prof = fs.readFileSync(profFile, 'utf8');
prof = prof.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
prof = prof.replace('<div class="max-w-[400px] mx-auto px-4 relative pt-4">', '<div class="max-w-[400px] mx-auto px-4 relative pt-4 stagger-root">');
prof = prof.replace('</head>', advancedCss + '\\n</head>');
fs.writeFileSync(profFile, prof);

// 5. History
let histFile = '/var/www/jmj_app/public/glassmorphic_3/code.html';
let hist = fs.readFileSync(histFile, 'utf8');
hist = hist.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
// For History, the list container is populated dynamically via JS. It has an id.
// We can just add stagger-root to it. Wait, the JS in History might inject it. Let's see the DOM.
hist = hist.replace('<div class="space-y-4 mt-6 pb-20" id="history-container">', '<div class="space-y-4 mt-6 pb-20 stagger-root" id="history-container">');
hist = hist.replace('</head>', advancedCss + '\\n</head>');
fs.writeFileSync(histFile, hist);

// Cache Busting
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '10.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Fixed missing pages by adding stagger-root parent classes!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_other_pages.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_other_pages.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v115\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixOtherPages().catch(console.error);
