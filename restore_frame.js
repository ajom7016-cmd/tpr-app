const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read index.html (landing page)
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Reverse the global background replace
    html = html.replace(/background:\s*#e2e8f0;/g, "background: #000;");
    
    // Write it back
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Restored phone frame colors!");
    ssh.dispose();
}
fix().catch(console.error);
