const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixIframeCache() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const appPath = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(appPath, 'utf8');

// Replace the fixed timestamp that is locking all iframes into the old cached version
content = content.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");

fs.writeFileSync(appPath, content);
console.log('Successfully updated iframe cache buster in app.html');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_iframe_cache.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_iframe_cache.js');
    console.log(res.stdout);
    
    // Also, clear sw.js cache name one more time to be absolutely sure
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixIframeCache().catch(console.error);
