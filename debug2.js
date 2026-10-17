const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function check() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('pm2 logs --nostream', {cwd: '/var/www/jmj_app'});
    console.log("PM2 LOGS:\n", res.stdout, res.stderr);
    
    res = await ssh.execCommand('node server.js', {cwd: '/var/www/jmj_app'});
    console.log("NODE RUN:\n", res.stdout, res.stderr);
    
    ssh.dispose();
}
check();
