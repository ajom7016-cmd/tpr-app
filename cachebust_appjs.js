const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cacheBustAppJs() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Add cache buster to app.js
    html = html.replace(/<script src="\/js\/app\.js(\?v=[0-9]+)?"><\/script>/g, '<script src="/js/app.js?v=' + Date.now() + '"></script>');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("Cache busted app.js in login.html!");
    ssh.dispose();
}
cacheBustAppJs().catch(console.error);
