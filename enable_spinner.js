const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function enableSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Enable in index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace(/display: none !important; flex-direction: column; justify-content: center;/g, 'display: flex; flex-direction: column; justify-content: center;');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Enable in app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace(/display: none !important; flex-direction: column; justify-content: center;/g, 'display: flex; flex-direction: column; justify-content: center;');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Spinner re-enabled successfully!");
    ssh.dispose();
}
enableSpinner().catch(console.error);
