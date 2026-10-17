const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findMesh() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('grep -rn "radial-gradient" /var/www/jmj_app/public/');
    console.log(r.stdout);
    ssh.dispose();
}
findMesh();
