const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixSupportDirect() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/support_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Min width
if (!content.includes('min-width: 0;')) {
    content = content.replace('.chat-input {', '.chat-input { min-width: 0;');
}

// 2. Hide mic when typing
const cssToInject = \`
<style>
.chat-input:not(:placeholder-shown) ~ div #mic-btn {
    display: none !important;
}
</style>
</head>
\`;

if (!content.includes('~ div #mic-btn')) {
    content = content.replace('</head>', cssToInject);
}

fs.writeFileSync(file, content);
console.log('Fixed CSS directly on remote!');

// Cache Busting
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '18.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_support_direct.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_support_direct.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v160\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixSupportDirect().catch(console.error);
