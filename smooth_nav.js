const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function smoothNav() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite loadPage for smooth depth transition
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            frame.style.transition = 'all 0.15s ease-out';
            frame.style.transform = 'scale(0.96) translateY(10px)';
            frame.style.opacity = '0.2';
            setTimeout(() => { frame.src = finalUrl; }, 120);
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Rewrite onload listener for bouncy spring entrance
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.style.opacity = '1';
                this.style.transform = 'scale(1) translateY(0px)';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.45'");

fs.writeFileSync(file, content);
console.log('Smooth iOS-style depth transition applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/smooth_nav.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/smooth_nav.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v32\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
smoothNav().catch(console.error);
