const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function injectCSS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const cssToInject = \`
<style>
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(20px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
#tasks-container > div {
    animation: popUpStagger 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
}
#tasks-container > div:nth-child(1) { animation-delay: 0.05s; }
#tasks-container > div:nth-child(2) { animation-delay: 0.12s; }
#tasks-container > div:nth-child(3) { animation-delay: 0.19s; }
#tasks-container > div:nth-child(4) { animation-delay: 0.26s; }
#tasks-container > div:nth-child(5) { animation-delay: 0.33s; }
#tasks-container > div:nth-child(6) { animation-delay: 0.40s; }
</style>
\`;

// If it already exists, remove it
content = content.replace(/<style>[\\s\\S]*?popUpStagger[\\s\\S]*?<\\/style>/, '');

// Inject before </head>
content = content.replace('</head>', cssToInject + '\\n</head>');

fs.writeFileSync(file, content);
console.log('CSS Staggered Animation injected successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/inject_css.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/inject_css.js');
    console.log(res.stdout);
    
    // Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v69\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
injectCSS().catch(console.error);
