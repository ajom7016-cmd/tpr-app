const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function perfectAppleNav() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite loadPage for zero-delay fetch but smooth CSS animation
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // 1. Instantly trigger the 'pressed' visual state
            frame.style.transition = 'all 0.1s ease-out';
            frame.style.transform = 'scale(0.98)';
            frame.style.opacity = '0.4';
            
            // 2. ZERO DELAY FETCH. Start loading the new page immediately!
            frame.src = finalUrl;
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Rewrite onload listener for Apple Spring Bounce
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                // Apple-style bouncy spring release
                this.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.49'");

fs.writeFileSync(file, content);
console.log('Perfect Apple Animation applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/apple_nav.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/apple_nav.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v35\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
perfectAppleNav().catch(console.error);
