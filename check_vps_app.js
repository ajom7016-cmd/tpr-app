const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function check() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    const res = await ssh.execCommand('sed -n "430,450p" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log('VPS glassmorphic_2/code.html lines 430-450:\n' + res.stdout);
    ssh.dispose();
}

check().catch(console.error);
