const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bumpSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let code = res.stdout;
    code = code.replace(/tpr-super-cache-v\d+/, 'tpr-super-cache-v22');
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    console.log("Bumped SW to v22!");
    ssh.dispose();
}
bumpSW().catch(console.error);
