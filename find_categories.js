const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findCategories() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rin "Video" /var/www/jmj_app/public/');
    console.log("Video: ", res.stdout);
    ssh.dispose();
}
findCategories().catch(console.error);
