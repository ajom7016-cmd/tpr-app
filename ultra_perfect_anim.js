const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraPerfectAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Exit Animation: Smooth push down (120ms)
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // Perfect iOS Push-down Exit
            frame.style.transition = 'transform 0.12s ease-out, opacity 0.12s ease-out';
            frame.style.transform = 'scale(0.96)';
            frame.style.opacity = '0.3';
            
            // Swap precisely when the push-down finishes
            setTimeout(() => { frame.src = finalUrl; }, 120);
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Entrance Animation: Spring bounce up
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                // Perfect iOS Spring-up Entrance
                this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-in-out';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Bump version
content = content.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '2.3.0';");

fs.writeFileSync(file, content);
console.log('Ultra Perfect Dip-and-Rise Animation applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/ultra_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/ultra_anim.js');
    console.log(res.stdout);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v67\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
ultraPerfectAnim().catch(console.error);
