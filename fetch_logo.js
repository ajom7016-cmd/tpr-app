const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fetchLogo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ls -la /var/www/jmj_app/public/assets/');
    console.log(res.stdout);
    
    // Download the 512x512 logo to his local machine so he can upload it
    await ssh.getFile('C:\\Users\\ajom7\\Downloads\\whatsapp_group_logo.png', '/var/www/jmj_app/public/assets/app-icon-512.png');
    console.log("Downloaded to C:\\Users\\ajom7\\Downloads\\whatsapp_group_logo.png");
    
    ssh.dispose();
}
fetchLogo().catch(console.error);
