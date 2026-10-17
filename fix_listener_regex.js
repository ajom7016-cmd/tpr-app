const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixListenerRegex() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Completely wipe out any display='block' assignments for vip-user-pic
    code = code.replace(/picEl\.style\.display\s*=\s*'block';/g, "picEl.classList.remove('hidden'); if(document.getElementById('vip-user-default')) document.getElementById('vip-user-default').classList.add('hidden');");
    
    // In tryLoadPic and the listener, validate that newPic actually is a base64 image!
    // We can just add a global check: if it's not base64, don't show it!
    code = code.replace(/if\s*\(newPic\)\s*{/g, "if (newPic && newPic.includes('data:image')) {");
    
    // Let's also bump the service worker cache to v4 just to be extremely sure!
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = res2.stdout;
    if(swCode.includes('tpr-super-cache-v3')) {
        swCode = swCode.replace('tpr-super-cache-v3', 'tpr-super-cache-v4');
        let b64_2 = Buffer.from(swCode).toString('base64');
        await ssh.execCommand(`echo "${b64_2}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("Fixed all rogue display:block overrides and enforced data:image validation!");
    
    ssh.dispose();
}
fixListenerRegex().catch(console.error);
