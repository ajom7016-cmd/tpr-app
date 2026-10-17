const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findGlassPanelFull() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -n "\\.glass-panel {" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    
    // get lines 60-120
    res = await ssh.execCommand('sed -n "80,130p" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
findGlassPanelFull().catch(console.error);
