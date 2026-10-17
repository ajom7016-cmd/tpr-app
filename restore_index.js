const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function restore() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Restoring index.html from index_dump.html...");
    
    const html = fs.readFileSync('index_dump.html', 'utf8');
    const b64 = Buffer.from(html).toString('base64');
    
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Restored index.html perfectly!");
    
    ssh.dispose();
}
restore().catch(console.error);
