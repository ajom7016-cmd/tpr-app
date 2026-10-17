const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bumpCaches() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let code = res.stdout;
    code = code.replace(/tpr-super-cache-v\d+/, 'tpr-super-cache-v23');
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let appRes = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = appRes.stdout;
    appCode = appCode.replace(/const timestamp = '\d+\.\d+\.\d+'/, "const timestamp = '1.0.23'");
    let appB64 = Buffer.from(appCode).toString('base64');
    await ssh.execCommand(`echo "${appB64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Bumped caches!");
    ssh.dispose();
}
bumpCaches().catch(console.error);
