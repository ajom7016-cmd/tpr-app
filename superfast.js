const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Fix server.js caching
    let res = await ssh.execCommand("cat /var/www/jmj_app/server.js");
    let code = res.stdout;
    
    // Remove the no-cache middleware
    code = code.replace(/app\.use\(\(req, res, next\) => \{[\s\S]*?res\.setHeader\('Expires', '0'\);\s*next\(\);\s*\}\);/g, "");
    
    let base64Code = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > /var/www/jmj_app/server.js`);
    await ssh.execCommand("pm2 restart all");
    
    // 2. Fix index.html (remove meta cache tags and add white background to iframe)
    res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    // Remove meta tags
    html = html.replace(/<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\s*<meta http-equiv="Pragma" content="no-cache">\s*<meta http-equiv="Expires" content="0">/g, "");
    
    // Add background: #f8fafc; to the iframe CSS
    html = html.replace(/\.frame-1 \.screen-area iframe\s*\{/g, ".frame-1 .screen-area iframe { background: #f8fafc; ");
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Caching restored, iframe background fixed!");
    ssh.dispose();
}
fix().catch(console.error);
