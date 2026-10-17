const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPrecache() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/sw.js';
let content = fs.readFileSync(file, 'utf8');

// Update PRECACHE_URLS to include all main app pages
const newPrecache = "const PRECACHE_URLS = ['/', '/login.html', '/app.html', '/assets/tailwind-compiled.css', '/assets/app-icon-192.png', '/glassmorphic_1/code.html', '/glassmorphic_2/code.html', '/investment_premium_glass/vip.html', '/user_profile_premium_glass/code.html', '/history_glass/code.html', '/deposit_glass/code.html', '/withdraw_glass/code.html'];";
content = content.replace(/const PRECACHE_URLS = .*/, newPrecache);

// Increment cache version
content = content.replace(/const CACHE_NAME = 'tpr-super-cache-v[0-9]+';/, "const CACHE_NAME = 'tpr-super-cache-v65';");
// Add force timestamp
content += "\\n// Precache bump " + Date.now();

fs.writeFileSync(file, content);

// Also bump app.html timestamp
const appFile = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appFile, 'utf8');
app = app.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '2.1.0';");
fs.writeFileSync(appFile, app);

console.log('Fixed Precache! Main pages will now load instantly even on the first click.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_precache.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_precache.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixPrecache().catch(console.error);
