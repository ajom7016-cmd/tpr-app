const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();
async function downloadAdminCurrent() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\admin_current.html', res.stdout);
    console.log("Downloaded admin_current.html");
    ssh.dispose();
}
downloadAdminCurrent().catch(console.error);
