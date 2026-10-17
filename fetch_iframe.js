const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fetchIframeLogic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -B 2 -A 5 "<iframe"');
    console.log("Iframe HTML:\n", res.stdout);
    
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -A 20 "function loadPage"');
    console.log("LoadPage Function:\n", res2.stdout);
    
    ssh.dispose();
}
fetchIframeLogic().catch(console.error);
