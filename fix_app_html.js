const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const appFile = '/var/www/jmj_app/public/app.html';
const swFile = '/var/www/jmj_app/public/sw.js';

let app = fs.readFileSync(appFile, 'utf8');
app = app.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.35'");
fs.writeFileSync(appFile, app);

let sw = fs.readFileSync(swFile, 'utf8');
sw = sw.replace(/CACHE_NAME = 'tpr-cache-v[0-9.]+'/, "CACHE_NAME = 'tpr-cache-v1.0.35'");
fs.writeFileSync(swFile, sw);

console.log('Fixed app.html and sw.js to 1.0.35!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_app_html.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_app_html.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixAppHtml().catch(console.error);
