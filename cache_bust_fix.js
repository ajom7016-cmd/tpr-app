const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function cacheBustFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Fix app.html cache bust (matching double or single quotes)
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = [\\'\\"][^\\'\\"]+[\\'\\"];/, \\"const currentVersion = '\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    
    // Fix sw.js cache bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let swPath = '/var/www/jmj_app/public/sw.js'; let sw = fs.readFileSync(swPath, 'utf8'); sw = sw.replace(/const CACHE_NAME = [\\'\\"]tpr-super-cache-[^\\'\\"]+[\\'\\"];/, \\"const CACHE_NAME = 'tpr-super-cache-\\" + Date.now() + \\"';\\"); fs.writeFileSync(swPath, sw);"`);
    
    // Check if it worked
    let r1 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep currentVersion');
    console.log("App HTML version:", r1.stdout);
    
    let r2 = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js | head -n 1');
    console.log("SW version:", r2.stdout);
    
    ssh.dispose();
}
cacheBustFix().catch(console.error);
