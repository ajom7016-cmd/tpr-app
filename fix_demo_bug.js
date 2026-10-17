const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDemoBug() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let html = res.stdout;
    
    // Remove the hardcoded override
    html = html.replace(/<script>window\.isLandingDemo = true;<\/script>/g, '');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Hardcoded demo bug removed from app.html!");
    ssh.dispose();
}
fixDemoBug().catch(console.error);
