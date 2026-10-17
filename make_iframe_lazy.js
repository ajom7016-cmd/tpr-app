const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function makeIframeLazy() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Add loading="lazy" to the iframe
    html = html.replace(/<iframe sandbox="([^"]+)" src='\/app\.html([^']*)'><\/iframe>/g, '<iframe sandbox="$1" src=\'/app.html$2\' loading="lazy"></iframe>');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Iframe made lazy!");
    ssh.dispose();
}
makeIframeLazy().catch(console.error);
