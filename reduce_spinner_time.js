const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function reduceSpinnerTime() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Reduce time in index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace('transition: opacity 0.4s ease-out', 'transition: opacity 0.15s ease-out');
    html = html.replace("setTimeout(() => p.style.display = 'none', 400);", "setTimeout(() => p.style.display = 'none', 150);");
    html = html.replace("window.addEventListener('load', () => setTimeout(hidePreloader, 300));", "window.addEventListener('load', hidePreloader);");
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Reduce time in app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace('transition: opacity 0.4s ease-out', 'transition: opacity 0.15s ease-out');
    appHtml = appHtml.replace("setTimeout(() => p.style.display = 'none', 400);", "setTimeout(() => p.style.display = 'none', 150);");
    appHtml = appHtml.replace("window.addEventListener('load', () => setTimeout(hidePreloader, 300));", "window.addEventListener('load', hidePreloader);");
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Spinner time reduced successfully!");
    ssh.dispose();
}
reduceSpinnerTime().catch(console.error);
