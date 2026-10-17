const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fetchHighResLogos() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Download logo.png
    await ssh.getFile('C:\\Users\\ajom7\\Downloads\\whatsapp_logo_hd.png', '/var/www/jmj_app/public/assets/logo.png');
    
    // Download tpr-ai-logo.jpg
    await ssh.getFile('C:\\Users\\ajom7\\Downloads\\whatsapp_logo_ultra_hd.jpg', '/var/www/jmj_app/public/assets/tpr-ai-logo.jpg');
    
    console.log("Downloaded HD logos!");
    ssh.dispose();
}
fetchHighResLogos().catch(console.error);
