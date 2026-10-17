const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceBumpSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/sw.js';
let content = fs.readFileSync(file, 'utf8');

// Increment the version number to force a Service Worker update on all clients!
content = content.replace(/const CACHE_NAME = 'tpr-super-cache-v[0-9]+';/, "const CACHE_NAME = 'tpr-super-cache-v60';");
// Add a comment to definitely change the byte signature of the file
content += "\\n// Forced bump " + Date.now();

fs.writeFileSync(file, content);

// Also bump app.html timestamp so it requests new iframes
const appFile = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appFile, 'utf8');
app = app.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '2.0.0';");
fs.writeFileSync(appFile, app);

console.log('Force bumped SW and App.html!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/bump_sw.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/bump_sw.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
forceBumpSW().catch(console.error);
