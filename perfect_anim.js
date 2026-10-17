const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function perfectAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite loadPage for glitch-free pop-in animation
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // Hide instantly to prevent native iframe white-flash glitch
            frame.style.transition = 'none';
            frame.style.opacity = '0';
            frame.style.transform = 'scale(0.97)';
            
            // Swap src after 10ms so the CSS hide is fully painted
            setTimeout(() => { frame.src = finalUrl; }, 10);
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Rewrite onload listener for smooth pop-in
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                // Smooth Pop-in Entrance
                this.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease-out';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Bump version
content = content.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '2.2.0';");

fs.writeFileSync(file, content);
console.log('Glitch-free Pop-in Animation applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/perfect_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/perfect_anim.js');
    console.log(res.stdout);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v66\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
perfectAnim().catch(console.error);
