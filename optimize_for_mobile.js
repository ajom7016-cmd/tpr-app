const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function optimizeForMobile() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// Add will-change to iframe for mobile GPU hardware acceleration
if(!content.includes('will-change: transform, opacity;')) {
    content = content.replace('id="app-frame" allow="microphone; camera" src="" style="', 'id="app-frame" allow="microphone; camera" src="" style="will-change: transform, opacity; ');
}

// 1. Rewrite loadPage animation to explicitly use transform and opacity (not 'all') for 60fps mobile rendering
const oldLoadBlockRegex = /frame\\.style\\.transition = 'all 0\\.1s ease-out';/g;
content = content.replace(oldLoadBlockRegex, "frame.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';");

// 2. Rewrite onload listener for mobile
const oldLoadListenerRegex = /this\\.style\\.transition = 'all 0\\.5s cubic-bezier\\(0\\.34, 1\\.56, 0\\.64, 1\\)';/g;
content = content.replace(oldLoadListenerRegex, "this.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';");

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.53'");

fs.writeFileSync(file, content);
console.log('Mobile GPU Acceleration applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/mobile_optimize.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/mobile_optimize.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v39\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
optimizeForMobile().catch(console.error);
