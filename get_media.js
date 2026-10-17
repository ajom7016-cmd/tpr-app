const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getFullMediaQuery() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('sed -n "/@media (max-width: 768px)/,/<\\/style>/p" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
getFullMediaQuery().catch(console.error);
