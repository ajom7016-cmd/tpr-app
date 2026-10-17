const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function downloadFiles() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.getFile('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\live_vip.html', '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    await ssh.getFile('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\live_profile.html', '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    console.log("Downloaded files.");
    ssh.dispose();
}
downloadFiles();
