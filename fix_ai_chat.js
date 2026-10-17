const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // 1. Add allow-modals to index.html sandbox
    let res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let indexHtml = res.stdout;
    indexHtml = indexHtml.replace(
        /sandbox="allow-scripts allow-same-origin allow-popups allow-forms"/g,
        'sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"'
    );
    let b64i = Buffer.from(indexHtml).toString('base64');
    await ssh.execCommand(`echo "${b64i}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Fixed index.html sandbox to allow alerts");

    // 2. Fix app.html fetch interceptor to ALLOW /api/support/chat
    res = await ssh.execCommand("cat /var/www/jmj_app/public/app.html");
    let appHtml = res.stdout;
    appHtml = appHtml.replace(
        /if \(method !== 'GET' \|\|/g,
        "if ((method !== 'GET' && !(args[0] && args[0].includes('/api/support/chat'))) ||"
    );
    let b64a = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64a}" | base64 -d > /var/www/jmj_app/public/app.html`);
    console.log("Fixed app.html fetch interceptor to allow AI chat");

    // 3. Remove authenticateToken from /api/support/chat in server.js
    res = await ssh.execCommand("cat /var/www/jmj_app/server.js");
    let serverJs = res.stdout;
    serverJs = serverJs.replace(
        /app\.post\('\/api\/support\/chat',\s*authenticateToken,\s*async\s*\(req,\s*res\)\s*=>\s*\{/g,
        "app.post('/api/support/chat', async (req, res) => {"
    );
    let b64s = Buffer.from(serverJs).toString('base64');
    await ssh.execCommand(`echo "${b64s}" | base64 -d > /var/www/jmj_app/server.js`);
    
    // Restart Node.js server to apply server.js changes
    await ssh.execCommand("pm2 restart all || systemctl restart jmj_app || forever restartall");
    console.log("Fixed server.js and restarted server");

    console.log("All done! Support chat will now work in the demo!");
    ssh.dispose();
}
fix().catch(console.error);
