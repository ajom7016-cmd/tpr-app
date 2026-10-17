const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bumpIframeVersion() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    
    // Bump the version string from 1.0.1 to 1.0.2 to force a fresh download
    code = code.replace("const timestamp = '1.0.1';", "const timestamp = '1.0.2';");
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Bumped iframe cache version to 1.0.2!");
    
    ssh.dispose();
}
bumpIframeVersion().catch(console.error);
