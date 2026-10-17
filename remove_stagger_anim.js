const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function removeStaggerAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const files = [
        '/var/www/jmj_app/public/glassmorphic_1/code.html',
        '/var/www/jmj_app/public/glassmorphic_2/code.html',
        '/var/www/jmj_app/public/investment_premium_glass/vip_final.html',
        '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html',
        '/var/www/jmj_app/public/glassmorphic_3/code.html'
    ];
    
    for (let file of files) {
        console.log("Cleaning", file);
        // 1. Remove the stagger-anim CSS block
        await ssh.execCommand(`sed -i '/<style id="stagger-anim">/,/<\\/style>/d' ${file}`);
        
        // 2. Remove the inline script that adds trigger-anim
        await ssh.execCommand(`sed -i '/<script>/,/<\\/script>/ { /trigger-anim/d }' ${file}`);
        
        // Wait, the inline script block might be multi-line. Let's use a more robust way.
        // It's safer to download, replace, and upload. But since I can't upload big files easily, 
        // I will just use sed to delete any line containing trigger-anim
        await ssh.execCommand(`sed -i '/trigger-anim/d' ${file}`);
    }
    
    // Also bump cache
    const timestamp = Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = 'v_${timestamp}';/g" /var/www/jmj_app/public/app.html`);
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${timestamp}';/g" /var/www/jmj_app/public/sw.js`);
    
    ssh.dispose();
}
removeStaggerAnim().catch(console.error);
