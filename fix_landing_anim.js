const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Remove inline opacity: 0
    html = html.replace(/opacity:\s*0/g, "opacity: 1");
    
    // Remove the smoothLoad animation class/css
    html = html.replace(/animation:\s*smoothLoad\s*0\.4s\s*ease-out\s*forwards;/g, "");
    html = html.replace(/@keyframes\s*smoothLoad\s*\{\s*0%\s*\{\s*opacity:\s*0;\s*\}\s*100%\s*\{\s*opacity:\s*1;\s*\}\s*\}/g, "");
    
    // There was an intersection observer script that added 'animation: smoothLoad' or changed opacity.
    // We can just leave the script, but since opacity is 1 by default now, it will just show instantly.
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Removed ALL fade-ins from landing page!");
    ssh.dispose();
}
fix().catch(console.error);
