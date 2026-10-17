const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function disableSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Disable in index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace(/display: flex; flex-direction: column; justify-content: center;/g, 'display: none !important; flex-direction: column; justify-content: center;');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Disable in app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace(/display: flex; flex-direction: column; justify-content: center;/g, 'display: none !important; flex-direction: column; justify-content: center;');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Spinner disabled (hidden) successfully without deleting code!");
    ssh.dispose();
}
disableSpinner().catch(console.error);
