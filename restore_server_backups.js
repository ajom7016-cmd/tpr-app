const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');
async function restoreServerBackups() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Restore the true 21KB Profile page
    let profileBackup = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/debug_profile.html', 'utf8');
    let b64Profile = Buffer.from(profileBackup).toString('base64');
    await ssh.execCommand(`echo "${b64Profile}" | base64 -d > /var/www/jmj_app/public/user_profile_premium_glass/code.html`);
    console.log("True Server Profile restored!");

    // 2. Restore the true 51KB VIP page
    let vipBackup = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/debug_vip.html', 'utf8');
    
    // Wait! The user complained earlier today that the Plan page was lagging because of the bg-3d animation.
    // I should probably remove the bg-3d block from this backup before uploading, but very carefully using DOM or precise indexOf so I don't break the layout again like last time.
    let startIdx = vipBackup.indexOf('<div class="bg-3d">');
    if (startIdx !== -1) {
        // Find the matching closing div for bg-3d.
        // It's followed by 4 inner divs, so we can just look for '<div class="bg-block-2"></div>\n    </div>'
        let endStr = '<div class="bg-block-2"></div>\n    </div>';
        let endIdx = vipBackup.indexOf(endStr, startIdx);
        if (endIdx !== -1) {
            vipBackup = vipBackup.substring(0, startIdx) + vipBackup.substring(endIdx + endStr.length);
        }
    }
    // Remove the literal '\\n' that I might have accidentally saved in the backup if the backup was taken after a bug?
    // Wait, debug_vip.html was from 9:18 PM. The \n bug was introduced at 10:29 PM in prepare_final_perfect_vip.js.
    // So debug_vip.html does NOT have the \n bug! It is completely safe.
    
    let b64Vip = Buffer.from(vipBackup).toString('base64');
    await ssh.execCommand(`echo "${b64Vip}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
    console.log("True Server VIP restored!");
    
    // 3. Cache bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    await ssh.execCommand(`node -e "const fs = require('fs'); let swPath = '/var/www/jmj_app/public/sw.js'; let sw = fs.readFileSync(swPath, 'utf8'); sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, \\"const CACHE_NAME = 'tpr-super-cache-\\" + Date.now() + \\"';\\"); fs.writeFileSync(swPath, sw);"`);
    console.log("Caches busted globally.");
    
    ssh.dispose();
}
restoreServerBackups().catch(console.error);
