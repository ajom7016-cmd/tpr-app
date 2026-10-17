const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fetchLive() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('curl -s http://localhost/index.html | grep -A 10 ".app-preview-section {"');
    console.log(res.stdout);
    ssh.dispose();
}
fetchLive().catch(console.error);
