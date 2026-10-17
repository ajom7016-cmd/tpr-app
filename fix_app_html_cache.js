const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAppHtmlCache() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Inject cache-busting directly into the loadPage function of app.html!
    // This way ALL iframes get a fresh version every time the app loads!
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// Find the loadPage function
if(content.includes('function loadPage(url')) {
    // If we haven't already modified it to add ?v=
    if(!content.includes('url += (url.includes(')) {
        content = content.replace(
            "document.getElementById('app-frame').src = url;",
            "url += (url.includes('?') ? '&' : '?') + 'v=' + Date.now();\\n        document.getElementById('app-frame').src = url;"
        );
        fs.writeFileSync(file, content);
        console.log('Injected global cache-busting into loadPage() in app.html');
    }
}
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_app_cache.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_app_cache.js');
    console.log(res.stdout);
    
    // Bust SW cache so the new app.html is served
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixAppHtmlCache().catch(console.error);
