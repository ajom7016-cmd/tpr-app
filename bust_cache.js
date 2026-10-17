const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceGlobalCacheBust() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Cache bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    await ssh.execCommand(`node -e "const fs = require('fs'); let swPath = '/var/www/jmj_app/public/sw.js'; let sw = fs.readFileSync(swPath, 'utf8'); sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, \\"const CACHE_NAME = 'tpr-super-cache-\\" + Date.now() + \\"';\\"); fs.writeFileSync(swPath, sw);"`);
    
    console.log("Global cache busted again!");
    ssh.dispose();
}
forceGlobalCacheBust().catch(console.error);
