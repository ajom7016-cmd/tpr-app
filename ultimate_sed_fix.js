const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function ultimateSedFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Applying VIP Fixes...");
    // 1. VIP Page: Remove bg-3d
    await ssh.execCommand('sed -i "/<!-- Premium Animated Background Light -->/,/<div class=\\"px-6 pb-2\\">/ { /<div class=\\"px-6 pb-2\\">/!d }" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    // 2. VIP Page: Fix overlapping cards (change h-[225px] to h-auto min-h-[240px] pb-10)
    await ssh.execCommand('sed -i "s/h-\\[225px\\]/h-auto min-h-\\[240px\\] pb-10/g" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    console.log("Applying Profile Fixes...");
    // 3. Profile Page: Remove opacity: 0 and animation to prevent invisible glitch
    await ssh.execCommand('sed -i "s/opacity: 0;//g" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    await ssh.execCommand('sed -i "s/animation: smoothLoad 0.4s ease-out forwards;//g" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    
    // Do the same for VIP page just in case
    await ssh.execCommand('sed -i "s/opacity: 0;//g" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    await ssh.execCommand('sed -i "s/animation: smoothLoad 0.3s ease-out forwards;//g" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    console.log("Cache Busting...");
    // 4. Cache bust app.html (using sed)
    const timestamp = Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = '${timestamp}';/g" /var/www/jmj_app/public/app.html`);
    
    // 5. Cache bust sw.js
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${timestamp}';/g" /var/www/jmj_app/public/sw.js`);
    
    // Let's verify changes!
    let v1 = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html | grep bg-3d');
    console.log("VIP bg-3d:", v1.stdout);
    
    let v2 = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html | grep min-h');
    console.log("VIP min-h:", v2.stdout.substring(0, 100));
    
    let v3 = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep opacity:');
    console.log("Profile opacity:", v3.stdout);
    
    let v4 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep currentVersion');
    console.log("App Version:", v4.stdout);

    ssh.dispose();
}
ultimateSedFix().catch(console.error);
