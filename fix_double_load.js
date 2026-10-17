const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDoubleLoad() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    // Remove the 800ms fallback so it waits exactly for Tailwind and tiny images
    html = html.replace(/setTimeout\(hidePreloader, 800\); \/\/ Super fast fallback/g, '');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    // Remove the 800ms fallback so it waits exactly for Tailwind and tiny images
    appHtml = appHtml.replace(/setTimeout\(hidePreloader, 800\); \/\/ Super fast fallback/g, '');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Removed 800ms fallback to prevent FOUC (double load visual bug)!");
    ssh.dispose();
}
fixDoubleLoad().catch(console.error);
