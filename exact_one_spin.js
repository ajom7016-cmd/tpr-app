const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function exactOneSpin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Set animation to 1s
    html = html.replace(/animation: tpr-spin 2\.5s/g, 'animation: tpr-spin 1.0s');
    
    // Remove all event listeners and just use a hard 1000ms timeout!
    html = html.replace("document.addEventListener('DOMContentLoaded', hidePreloader); window.addEventListener('load', hidePreloader);", "");
    html = html.replace('setTimeout(hidePreloader, 800);', 'setTimeout(hidePreloader, 1000);');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace(/animation: tpr-spin 2\.5s/g, 'animation: tpr-spin 1.0s');
    appHtml = appHtml.replace("document.addEventListener('DOMContentLoaded', hidePreloader); window.addEventListener('load', hidePreloader);", "");
    appHtml = appHtml.replace('setTimeout(hidePreloader, 800);', 'setTimeout(hidePreloader, 1000);');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    console.log("Spinner set to exactly 1s (one spin)!");
    ssh.dispose();
}
exactOneSpin().catch(console.error);
