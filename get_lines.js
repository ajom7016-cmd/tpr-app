const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getLines() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand("sed -n '400,420p' /var/www/jmj_app/public/glassmorphic_2/code.html");
    console.log(res.stdout);
    ssh.dispose();
}
getLines().catch(console.error);
