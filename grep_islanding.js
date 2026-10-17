const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepIsLandingDemo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn -i "window.isLandingDemo" /var/www/jmj_app/public/');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
grepIsLandingDemo().catch(console.error);
