const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function wipePreloaderJS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Wipe the hidePreloader function
    html = html.replace(/function hidePreloader\(\) \{[\s\S]*?setTimeout\(hidePreloader, 1000\); \/\/ Exactly 1s spin!/g, '');
    
    // Also remove any stray calls to hidePreloader if they exist
    html = html.replace(/hidePreloader\(\);/g, '');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Preloader JS wiped!");
    ssh.dispose();
}
wipePreloaderJS().catch(console.error);
