const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceCacheBustGlobal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

// 1. Force completely new Service Worker Cache Name
const swPath = '/var/www/jmj_app/public/sw.js';
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, "const CACHE_NAME = 'tpr-super-cache-" + Date.now() + "';");
fs.writeFileSync(swPath, sw);

// 2. Force hard reload logic in app.html
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');

// Update the currentVersion string in app.html so EVERY user's browser triggers the reload block
app = app.replace(/const currentVersion = "[^"]+";/, 'const currentVersion = "' + Date.now() + '";');

// Update iframe cache buster
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");

fs.writeFileSync(appPath, app);

console.log('Global Cache Busted!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/force_global_bust.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/force_global_bust.js');
    console.log(res.stdout);
    ssh.dispose();
}
forceCacheBustGlobal().catch(console.error);
