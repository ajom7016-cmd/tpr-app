const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fetchMobileHTML() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    require('fs').writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\live_index.html', html);
    console.log("Downloaded live HTML.");
    ssh.dispose();
}
fetchMobileHTML().catch(console.error);
