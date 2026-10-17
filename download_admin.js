const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();
async function downloadAdmin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.getFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\admin_original.html', '/var/www/jmj_app/public/admin.html');
    console.log("Downloaded admin.html successfully!");
    ssh.dispose();
}
downloadAdmin().catch(console.error);
