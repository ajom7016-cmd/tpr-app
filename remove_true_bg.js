const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function removeTrueBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const files = [
        '/var/www/jmj_app/public/investment_premium_glass/vip_final.html',
        '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html',
        '/var/www/jmj_app/public/glassmorphic_2/code.html'
    ];
    
    for (let file of files) {
        console.log("Fixing", file);
        // Remove true-bg block completely using sed multi-line
        await ssh.execCommand(`sed -i '/<style id="true-bg">/,/<\\/style>/d' ${file}`);
        
        // Just in case it was injected differently, let's remove any line with bg_main_py.jpg if it's in a style tag
        await ssh.execCommand(`sed -i '/url(\\'\\/assets\\/bg_main_py.jpg\\')/d' ${file}`);
    }
    
    // Check if it worked
    for (let file of files) {
        let r = await ssh.execCommand(`cat ${file} | grep -i bg_main`);
        console.log(file, "bg_main matches:", r.stdout);
    }
    
    // Let's also do a fresh cache bump for app.html and sw.js
    const timestamp = Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = '${timestamp}';/g" /var/www/jmj_app/public/app.html`);
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${timestamp}';/g" /var/www/jmj_app/public/sw.js`);
    
    ssh.dispose();
}
removeTrueBg().catch(console.error);
