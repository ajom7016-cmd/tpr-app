const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read index.html
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Remove the preload tags I added in nanosecond.js
    html = html.replace(/<link rel="preload" href="\/app\.html" as="document">/g, "");
    
    // Write it back
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Removed preload tags!");
    ssh.dispose();
}
fix().catch(console.error);
