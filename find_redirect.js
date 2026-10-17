const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findRedirect() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i "window.location" /var/www/jmj_app/public/app.html');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
findRedirect().catch(console.error);
