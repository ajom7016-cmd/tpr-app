const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function moveToast() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Replace bottom-10 with top-10
    html = html.replace('id="toast-container" class="fixed bottom-10', 'id="toast-container" class="fixed top-10');
    
    // In showToast function, change translate-y-4 (slide up from bottom) to -translate-y-4 (slide down from top)
    // Wait, the old code has: translate-y-4 max-w-sm
    html = html.replace('translate-y-4 max-w-sm', '-translate-y-4 max-w-sm');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("Toast moved to top!");
    ssh.dispose();
}
moveToast().catch(console.error);
