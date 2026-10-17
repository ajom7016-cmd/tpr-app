const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function downloadApp() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    fs.writeFileSync('app_live.html', res.stdout);
    console.log("Downloaded app.html!");
    ssh.dispose();
}
downloadApp().catch(console.error);
