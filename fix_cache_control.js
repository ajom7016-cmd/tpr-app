const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixCacheControl() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let server = res.stdout;
    
    // Replace the static middleware to NOT cache HTML files
    server = server.replace(
        "app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));",
        `app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days for assets
        }
    }
}));`
    );
    
    let b64 = Buffer.from(server).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
    await ssh.execCommand('pm2 restart server');
    
    console.log("Server Cache-Control fixed!");
    ssh.dispose();
}
fixCacheControl().catch(console.error);
