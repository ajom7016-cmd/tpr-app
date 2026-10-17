const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function optimizeServer() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let code = res.stdout;
    
    // 1. Enable GZIP compression
    if (!code.includes('app.use(compression())')) {
        code = code.replace('app.use(cors());', 'app.use(cors());\napp.use(compression());');
    }
    
    // 2. Fix the disastrous caching policy
    code = code.replace("res.set('Cache-Control', 'no-store');", "res.set('Cache-Control', 'public, max-age=604800'); // Cache for 7 days");

    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
    
    // Restart PM2
    await ssh.execCommand('pm2 restart server');
    
    console.log("Server Optimized and Restarted!");
    ssh.dispose();
}
optimizeServer().catch(console.error);
