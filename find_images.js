const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findImages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Find all image URLs in index.html
    let res = await ssh.execCommand('grep -oE "src=[^ >]+|url\\([^\\)]+\\)" /var/www/jmj_app/public/index.html');
    console.log("INDEX.HTML IMAGES:");
    console.log(res.stdout);
    
    ssh.dispose();
}
findImages().catch(console.error);
