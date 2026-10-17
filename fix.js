const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    console.log('Killing hung apt/dpkg...');
    await ssh.execCommand('killall -9 apt apt-get dpkg || true');
    await ssh.execCommand('rm /var/lib/dpkg/lock-frontend || true');
    await ssh.execCommand('rm /var/lib/dpkg/lock || true');
    await ssh.execCommand('rm /var/cache/apt/archives/lock || true');
    await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; dpkg --configure -a');

    console.log('Installing nodejs via nvm or nodesource...');
    let res = await ssh.execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -');
    console.log(res.stdout);
    res = await ssh.execCommand('export DEBIAN_FRONTEND=noninteractive; apt-get install -yq nodejs');
    console.log(res.stdout);
    
    console.log('Installing pm2...');
    await ssh.execCommand('npm install -g pm2');
    
    console.log('NPM install in app dir...');
    await ssh.execCommand('npm install', {cwd: '/var/www/jmj_app'});
    
    console.log('Starting app...');
    await ssh.execCommand('pm2 start server.js', {cwd: '/var/www/jmj_app'});
    await ssh.execCommand('pm2 save');
    
    console.log('Done.');
    ssh.dispose();
}
fix();
