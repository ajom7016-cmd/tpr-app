const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function removeTailwind() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Comment out Tailwind CDN
    html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<!-- <script src="https://cdn.tailwindcss.com"></script> -->');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Tailwind CDN disabled!");
    ssh.dispose();
}
removeTailwind().catch(console.error);
