const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read server.js
    let res = await ssh.execCommand("cat /var/www/jmj_app/server.js");
    let code = res.stdout;
    
    // Add no-cache middleware before express.static
    const noCacheMiddleware = `
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
    `;
    
    // Inject it right after `const app = express();`
    code = code.replace(/const app = express\(\);/, `const app = express();\n${noCacheMiddleware}`);
    
    let base64Code = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${base64Code}" | base64 -d > /var/www/jmj_app/server.js`);
    
    // Restart PM2 to apply changes
    await ssh.execCommand("pm2 restart all");
    
    // Also inject meta tags into index.html
    let htmlRes = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = htmlRes.stdout;
    const metaTags = `
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    `;
    html = html.replace(/<head>/, `<head>${metaTags}`);
    
    let base64Html = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Caching completely disabled on server.js and index.html!");
    ssh.dispose();
}
fix().catch(console.error);
