const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function removePreloader() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Remove the preloader HTML block completely
    // Using regex to match from <!-- Global Preloader --> to <!-- PRELOADER CLOSED HERE -->
    html = html.replace(/<!-- Global Preloader -->[\s\S]*?<!-- PRELOADER CLOSED HERE -->/g, '');
    
    // Also try removing by ID if the comments are missing
    html = html.replace(/<div id="tpr-global-preloader"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, ''); // Crude fallback
    
    // 2. Remove the JavaScript that handles the preloader
    html = html.replace(/const preloader = document\.getElementById\('tpr-global-preloader'\);[\s\S]*?\}, 150\);/g, '');

    // 3. Remove the spin animation CSS if it's there
    html = html.replace(/@keyframes tpr-spin \{ 0% \{ transform: rotate\(0deg\); \} 100% \{ transform: rotate\(360deg\); \} \}/g, '');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Preloader completely removed from index.html!");
    ssh.dispose();
}
removePreloader().catch(console.error);
