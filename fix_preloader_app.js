const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPreloaderApp() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let html = res.stdout;
    
    html = html.replace('setTimeout(hidePreloader, 1500); // Bulletproof fallback', 'setTimeout(hidePreloader, 5000); // Increased fallback for slow connections');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Preloader fallback increased to 5000ms in app.html!");
    ssh.dispose();
}
fixPreloaderApp().catch(console.error);
