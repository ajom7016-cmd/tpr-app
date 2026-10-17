const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getUrl2() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -r "server_name" /etc/nginx/');
    console.log("Server names: ", res.stdout);
    ssh.dispose();
}
getUrl2().catch(console.error);
