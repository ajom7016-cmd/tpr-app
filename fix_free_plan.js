const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixFreePlan() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Fix server.js
    const serverFix = `
const fs = require('fs');
const file = '/var/www/jmj_app/server.js';
let content = fs.readFileSync(file, 'utf8');

// Replace { 0: 10 } with { 0: 50 }
content = content.replace(/const roiMap = \\{ 0: 10/g, "const roiMap = { 0: 50");

fs.writeFileSync(file, content);
console.log('Fixed server.js!');
    `;
    
    let b64Srv = Buffer.from(serverFix).toString('base64');
    await ssh.execCommand(`echo "${b64Srv}" | base64 -d > /var/www/jmj_app/fix_srv_roi.js`);
    await ssh.execCommand('node /var/www/jmj_app/fix_srv_roi.js');
    await ssh.execCommand('pm2 restart jmj_app');
    
    // 2. Fix frontend (glassmorphic_2/code.html)
    const frontFix = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace { 0: 10 } with { 0: 50 }
content = content.replace(/const roiMap = \\{ 0: 10/g, "const roiMap = { 0: 50");

fs.writeFileSync(file, content);
console.log('Fixed frontend tasks page!');
    `;
    
    let b64Front = Buffer.from(frontFix).toString('base64');
    await ssh.execCommand(`echo "${b64Front}" | base64 -d > /var/www/jmj_app/fix_front_roi.js`);
    await ssh.execCommand('node /var/www/jmj_app/fix_front_roi.js');

    // 3. Bump cache
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v40\\'/g' /var/www/jmj_app/public/sw.js");

    ssh.dispose();
}
fixFreePlan().catch(console.error);
