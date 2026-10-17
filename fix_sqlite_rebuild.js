const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('npm rebuild sqlite3 --build-from-source', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout, res.stderr);
    res = await ssh.execCommand('pm2 restart server', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout);
    res = await ssh.execCommand('pm2 logs server --lines 5 --nostream', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout, res.stderr);
    ssh.dispose();
}
fix();
