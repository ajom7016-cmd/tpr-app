const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function speedUpAnimation() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Reduce setTimeout delay from 150ms to 20ms
content = content.replace(/setTimeout\\(\\(\\) => \\{ frame\\.src = finalUrl; \\}, 150\\);/, 'setTimeout(() => { frame.src = finalUrl; }, 20);');

// 2. Reduce CSS transition duration from 0.25s to 0.12s for snappier feel
content = content.replace(/transition: all 0\\.25s cubic-bezier/g, 'transition: all 0.12s cubic-bezier');

// 3. Just bump timestamp so changes take effect
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.40'");

fs.writeFileSync(file, content);
console.log('Animation sped up successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/speedup.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/speedup.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Also bump sw.js so app.html updates instantly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v28\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
speedUpAnimation().catch(console.error);
