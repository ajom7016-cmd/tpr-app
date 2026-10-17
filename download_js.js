const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function downloadJS() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.getFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/app_remote.js', '/var/www/jmj_app/public/js/app.js');
    console.log("Downloaded!");
    ssh.dispose();
}
downloadJS().catch(console.error);
