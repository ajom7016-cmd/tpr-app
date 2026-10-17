const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bumpCache() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const swFile = '/var/www/jmj_app/public/sw.js';
const appFile = '/var/www/jmj_app/public/app.html';

// 1. Bump SW cache version
let sw = fs.readFileSync(swFile, 'utf8');
sw = sw.replace(/CACHE_NAME = 'tpr-cache-v[0-9.]+'/, "CACHE_NAME = 'tpr-cache-v1.0.30'");
fs.writeFileSync(swFile, sw);

// 2. Bump app.html timestamp string
let app = fs.readFileSync(appFile, 'utf8');
app = app.replace(/let timestamp = '1\.0\.[0-9]+'/, "let timestamp = '1.0.30'");
fs.writeFileSync(appFile, app);

console.log('Cache version bumped to 1.0.30!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/bump_cache.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/bump_cache.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
bumpCache().catch(console.error);
