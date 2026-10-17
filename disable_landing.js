const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function disableLanding() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Rename index.html to landing.html
    await ssh.execCommand('mv /var/www/jmj_app/public/index.html /var/www/jmj_app/public/landing.html');
    
    // Add redirect to server.js right before app.use(express.static...)
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let code = res.stdout;
    
    code = code.replace(
        "app.use(express.static(path.join(__dirname, 'public')",
        "app.get('/', (req, res) => res.redirect('/login.html'));\napp.use(express.static(path.join(__dirname, 'public')"
    );
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
    
    // Restart PM2
    await ssh.execCommand('pm2 restart server');
    
    console.log("Landing page disabled and root redirected to login.html!");
    ssh.dispose();
}
disableLanding().catch(console.error);
