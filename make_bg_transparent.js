const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function makeBgTransparent() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // In index.html, there's a specific inline rule for .hero { background-color: #f1f5f9 !important; }
    // Let's replace it with transparent.
    html = html.replace(/\.hero \{ background-color: #[a-f0-9]+ !important; \}/g, '.hero { background-color: transparent !important; }');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Hero background made transparent!");
    ssh.dispose();
}
makeBgTransparent().catch(console.error);
