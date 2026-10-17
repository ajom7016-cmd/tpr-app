const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findSpinnerApp() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i -B 2 -A 5 "spinner" /var/www/jmj_app/public/app.html');
    console.log(res.stdout);
    ssh.dispose();
}
findSpinnerApp().catch(console.error);
