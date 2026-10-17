const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function thinLines() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    let original = html;
    
    // Change stroke-width: 1.5px to stroke-width: 0.3px
    html = html.replace('stroke-width: 1.5px !important;', 'stroke-width: 0.3px !important;');

    if (html !== original) {
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Lines thinned!");
    } else {
        console.log("No changes made. Regex might not have matched.");
    }

    ssh.dispose();
}
thinLines().catch(console.error);
