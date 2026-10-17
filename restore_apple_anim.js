const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreAppleAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Restore all pristine files (removes all staggered CSS injections)
    const pages = [
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_1/code.html', remote: '/var/www/jmj_app/public/glassmorphic_1/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_2/code.html', remote: '/var/www/jmj_app/public/glassmorphic_2/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', remote: '/var/www/jmj_app/public/investment_premium_glass/vip.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/user_profile_premium_glass/code.html', remote: '/var/www/jmj_app/public/user_profile_premium_glass/code.html' },
        { local: 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/glassmorphic_3/code.html', remote: '/var/www/jmj_app/public/glassmorphic_3/code.html' }
    ];
    
    for (const page of pages) {
        await ssh.putFile(page.local, page.remote);
    }
    console.log('Restored pristine HTML files (removed all cascade animations).');

    // 2. Rewrite app.html with the Ultra Perfect Apple Dip-and-Rise
    const script = `
const fs = require('fs');
const appFile = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(appFile, 'utf8');

// Replace loadPage block with the Apple Dip-and-Rise Exit
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

// Replace onload block with the Apple Spring-up Entrance
const oldLoadListenerRegex = /frame\\.addEventListener\\('load', function\\(\\) \\{[\\s\\S]*?\\}\\);/m;
const newLoadListener = \`frame.addEventListener('load', function() {
                // Perfect iOS Spring-up Entrance
                this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-in-out';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });\`;
content = content.replace(oldLoadListenerRegex, newLoadListener);

// Force cache bust to ensure all devices get the reverted change
const newVersion = '6.0.' + Date.now();
content = content.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");

fs.writeFileSync(appFile, content);
console.log('Restored Apple Dip-and-Rise in app.html');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_apple.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_apple.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v99\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
restoreAppleAnim().catch(console.error);
