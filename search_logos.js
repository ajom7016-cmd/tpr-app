const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function searchLogos() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ls -l /var/www/jmj_app/public/assets/');
    console.log("=== Assets Folder ===");
    console.log(res.stdout);
    
    let res2 = await ssh.execCommand('ls -l /var/www/jmj_app/public/ | grep -iE "\\.(png|jpg|jpeg|ico)"');
    console.log("=== Public Folder ===");
    console.log(res2.stdout);
    ssh.dispose();
}
searchLogos().catch(console.error);
