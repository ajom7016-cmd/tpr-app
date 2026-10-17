const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixCache() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.execCommand('cp /var/www/jmj_app/public/admin.html /var/www/jmj_app/public/admin2.html');
    console.log('Created admin2.html');
    ssh.dispose();
}
fixCache();
