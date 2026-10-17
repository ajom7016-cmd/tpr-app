const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getUrl() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep "server_name" /etc/nginx/sites-enabled/*');
    console.log("Server names: ", res.stdout);
    ssh.dispose();
}
getUrl().catch(console.error);
