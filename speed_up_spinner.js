const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function speedUpSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Modify index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    // Slow down rotation to 2.5s
    html = html.replace('animation: tpr-spin 1.5s', 'animation: tpr-spin 2.5s');
    // Force hide at 1000ms if load event hasn't fired yet
    html = html.replace('setTimeout(hidePreloader, 5000);', 'setTimeout(hidePreloader, 800); // Super fast fallback');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Modify app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace('animation: tpr-spin 1.5s', 'animation: tpr-spin 2.5s');
    appHtml = appHtml.replace('setTimeout(hidePreloader, 5000);', 'setTimeout(hidePreloader, 800); // Super fast fallback');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Spinner made faster (hides in < 1s) and rotation slowed to 2.5s!");
    ssh.dispose();
}
speedUpSpinner().catch(console.error);
