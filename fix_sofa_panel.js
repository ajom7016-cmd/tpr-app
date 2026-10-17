const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSofaPanel() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // The user wants the glass panel to be shorter in width (cut left and right) so it fits inside the armrests.
    // And they want it to be taller (mota).
    
    // 1. Shorter in width:
    // Change max-width: 660px to max-width: 600px and width: 100% to width: 75%
    html = html.replace(/width:\s*100%;\s*max-width:\s*660px;/g, 'width: 70%; max-width: 600px;');
    // In case it's slightly different:
    html = html.replace(/max-width:\s*660px;/g, 'max-width: 600px;');
    
    // 2. Taller in height (mota):
    // Add min-height: 300px and some padding so it grows vertically.
    // We can inject it right after max-width: 600px;
    html = html.replace(/max-width:\s*600px;/g, 'max-width: 600px;\n            min-height: 300px;\n            padding: 30px 0;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Sofa glass panel fixed (made narrower and taller)!");
    ssh.dispose();
}
fixSofaPanel().catch(console.error);
