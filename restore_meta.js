const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function restoreMeta() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Check if color-scheme meta exists
    if (!html.includes('color-scheme')) {
        // Insert it right after charset
        html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <meta name="color-scheme" content="light dark">');
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
        console.log("Restored color-scheme meta tag!");
    } else {
        console.log("color-scheme already exists.");
    }
    ssh.dispose();
}
restoreMeta().catch(console.error);
