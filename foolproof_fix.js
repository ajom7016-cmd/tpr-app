const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function foolproofFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Rename files on server to completely bypass cache
    await ssh.execCommand('cp /var/www/jmj_app/public/investment_premium_glass/vip.html /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    await ssh.execCommand('cp /var/www/jmj_app/public/user_profile_premium_glass/code.html /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    
    // 2. Update app.html to point to new files
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appContent = r.stdout;
    
    appContent = appContent.replace(/'investment_premium_glass\/vip\.html'/g, "'investment_premium_glass/vip_final.html'");
    appContent = appContent.replace(/'user_profile_premium_glass\/code\.html'/g, "'user_profile_premium_glass/code_final.html'");
    
    // Cache bust currentVersion
    appContent = appContent.replace(/const currentVersion = [\\'\\"][^\\'\\"]+[\\'\\"];/, "const currentVersion = '" + Date.now() + "';");
    
    let b64App = Buffer.from(appContent).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    // 3. Update sw.js to also precache the new files
    let rSw = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swContent = rSw.stdout;
    swContent = swContent.replace(/\/investment_premium_glass\/vip\.html/g, '/investment_premium_glass/vip_final.html');
    swContent = swContent.replace(/\/user_profile_premium_glass\/code\.html/g, '/user_profile_premium_glass/code_final.html');
    swContent = swContent.replace(/const CACHE_NAME = [\\'\\"]tpr-super-cache-[^\\'\\"]+[\\'\\"];/, "const CACHE_NAME = 'tpr-super-cache-" + Date.now() + "';");
    
    let b64Sw = Buffer.from(swContent).toString('base64');
    await ssh.execCommand(`echo "${b64Sw}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    console.log("Foolproof bypass applied!");
    ssh.dispose();
}
foolproofFix().catch(console.error);
