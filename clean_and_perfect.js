const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanAndPerfectAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

// 1. Fix glassmorphic_2 (Tasks page)
let tasksFile = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let tasksContent = fs.readFileSync(tasksFile, 'utf8');

// Remove the conflicting CSS block
tasksContent = tasksContent.replace(/<style>[\\s\\S]*?popUp \\{[\\s\\S]*?<\\/style>/, '');
// Remove the class from the HTML elements
tasksContent = tasksContent.replace(/ task-card-anim/g, '');
tasksContent = tasksContent.replace(/task-card-anim/g, ''); // just in case

// Redefine the stagger CSS cleanly
const tasksCss = \`
<style>
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(30px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
#tasks-container > div {
    animation: popUpStagger 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
}
#tasks-container > div:nth-child(1) { animation-delay: 0.04s; }
#tasks-container > div:nth-child(2) { animation-delay: 0.10s; }
#tasks-container > div:nth-child(3) { animation-delay: 0.16s; }
#tasks-container > div:nth-child(4) { animation-delay: 0.22s; }
#tasks-container > div:nth-child(5) { animation-delay: 0.28s; }
#tasks-container > div:nth-child(6) { animation-delay: 0.34s; }
</style>
\`;

// Replace existing popUpStagger block
tasksContent = tasksContent.replace(/<style>[\\s\\S]*?popUpStagger[\\s\\S]*?<\\/style>/, '');
tasksContent = tasksContent.replace('</head>', tasksCss + '\\n</head>');
fs.writeFileSync(tasksFile, tasksContent);


// 2. Fix other pages
const generalCss = \`
<style>
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
/* ONLY target direct children of MAIN to avoid double-animation inside grids */
main > div, main > section {
    animation: popUpStagger 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
}
main > *:nth-child(1) { animation-delay: 0.04s; }
main > *:nth-child(2) { animation-delay: 0.10s; }
main > *:nth-child(3) { animation-delay: 0.16s; }
main > *:nth-child(4) { animation-delay: 0.22s; }
main > *:nth-child(5) { animation-delay: 0.28s; }
main > *:nth-child(6) { animation-delay: 0.34s; }
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
        content = content.replace(/<style>[\\s\\S]*?popUpStagger[\\s\\S]*?<\\/style>/, '');
        content = content.replace('</head>', generalCss + '\\n</head>');
        fs.writeFileSync(page, content);
    }
}

console.log('Cleaned up animations for extreme smoothness!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/clean_perfect.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/clean_perfect.js');
    console.log(res.stdout);
    
    // Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v77\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
cleanAndPerfectAnim().catch(console.error);
