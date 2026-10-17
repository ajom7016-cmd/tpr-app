const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('npm uninstall sqlite3 && npm install sqlite3', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout, res.stderr);
    res = await ssh.execCommand('pm2 restart server', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout);
    ssh.dispose();
}
fix();
