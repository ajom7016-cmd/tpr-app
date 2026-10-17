const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixCacheAndListener() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Fix listener in glassmorphic_2/code.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    const oldListener = `if (newPic) {
                    const picEl = document.getElementById('vip-user-pic');
                    if (picEl) {
                        picEl.src = newPic;
                        picEl.style.display = 'block';
                    }
                }`;
    const newListener = `if (newPic && newPic.includes('data:image')) {
                    const picEl = document.getElementById('vip-user-pic');
                    const defEl = document.getElementById('vip-user-default');
                    if (picEl && defEl) {
                        picEl.src = newPic;
                        picEl.classList.remove('hidden');
                        picEl.style.display = '';
                        defEl.classList.add('hidden');
                    }
                }`;
    if(code.includes(oldListener)) {
        code = code.replace(oldListener, newListener);
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    }
    
    // 2. Bump Service Worker Cache to v3
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = res2.stdout;
    if(swCode.includes('tpr-super-cache-v2')) {
        swCode = swCode.replace('tpr-super-cache-v2', 'tpr-super-cache-v3');
        let b64_2 = Buffer.from(swCode).toString('base64');
        await ssh.execCommand(`echo "${b64_2}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    }
    
    console.log("Fixed listener and bumped SW cache to v3!");
    ssh.dispose();
}
fixCacheAndListener().catch(console.error);
