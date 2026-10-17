const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixFullName() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Replace the split logic to show full name
    code = code.replace("nameEl.innerText = profile.name.split(' ')[0];", "nameEl.innerText = profile.name;");
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("Full name fix applied!");
    
    ssh.dispose();
}
fixFullName().catch(console.error);
