const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixFixed() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.execCommand(`sed -i "s/no-repeat fixed;/no-repeat;/g" /var/www/jmj_app/public/investment_premium_glass/vip_final.html`);
    console.log("Fixed inline background-attachment in vip_final.html");
    
    // Also, just to be 1000% sure we bust the cache again, let's bump currentVersion to an exact string
    const v = "v_final_" + Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = '${v}';/g" /var/www/jmj_app/public/app.html`);
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${v}';/g" /var/www/jmj_app/public/sw.js`);
    console.log("Bumped cache to", v);
    ssh.dispose();
}
fixFixed().catch(console.error);
