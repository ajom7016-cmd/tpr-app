const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixForReal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const pages = [
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_1/code.html', remote: '/var/www/jmj_app/public/glassmorphic_1/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', remote: '/var/www/jmj_app/public/investment_premium_glass/vip.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/user_profile_premium_glass/code.html', remote: '/var/www/jmj_app/public/user_profile_premium_glass/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_3/code.html', remote: '/var/www/jmj_app/public/glassmorphic_3/code.html' }
    ];
    
    // Upload original files
    for (const page of pages) {
        await ssh.putFile(page.local, page.remote);
        console.log('Restored', page.remote);
    }
    
    // Now SAFELY inject the animation
    const safeScript = `
const fs = require('fs');
const pages = [
    '/var/www/jmj_app/public/glassmorphic_1/code.html',
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

for (let page of pages) {
    let content = fs.readFileSync(page, 'utf8');
    // Remove if exists
    content = content.replace(/<style id="stagger-anim">[\\s\\S]*?<\\/style>/, '');
    // Insert safely right before </head>
    content = content.replace('</head>', generalCss + '\\n</head>');
    fs.writeFileSync(page, content);
}
console.log('Safe animation applied!');
    `;
    
    let b64 = Buffer.from(safeScript).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/safe_anim_2.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/safe_anim_2.js');
    console.log(res.stdout);
    
    // Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v82\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixForReal().catch(console.error);
