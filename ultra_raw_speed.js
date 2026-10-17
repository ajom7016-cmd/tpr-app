const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraRawSpeed() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove all delays and exit animations in loadPage
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // ZERO DELAY, NO ANIMATION. RAW SPEED.
            frame.style.transition = 'none';
            frame.style.opacity = '1';
            frame.style.transform = 'none';
            frame.src = finalUrl;
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Remove all entrance animations in onload
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                this.style.transition = 'none';
                this.style.opacity = '1';
                this.style.transform = 'none';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.47'");

fs.writeFileSync(file, content);
console.log('Zero animation raw speed applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/raw_speed.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/raw_speed.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v33\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
ultraRawSpeed().catch(console.error);
