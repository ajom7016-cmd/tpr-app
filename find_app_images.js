const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findAppImages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -oE "src=[^ >]+|url\\([^\\)]+\\)" /var/www/jmj_app/public/app.html');
    console.log("APP.HTML IMAGES:");
    console.log(res.stdout);
    ssh.dispose();
}
findAppImages().catch(console.error);
