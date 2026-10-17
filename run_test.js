const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function runTest() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('node -e "const jwt = require(\'jsonwebtoken\'); const SECRET_KEY = \'your_super_secret_key\'; const token = jwt.sign({ id: 1, phone: \'01700000000\', role: \'admin\' }, SECRET_KEY); fetch(\'http://localhost:3000/api/admin/deposits\', {headers:{Authorization: \'Bearer \'+token}}).then(r=>r.text()).then(console.log);"');
    console.log("Response:", res.stdout);
    console.log("Error:", res.stderr);
    ssh.dispose();
}
runTest().catch(console.error);
