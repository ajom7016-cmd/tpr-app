const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAuthAdmin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let code = res.stdout;
    
    const authAdminFunc = `
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({error: 'Admin access required'});
        next();
    });
};

// ==========================================
// NEW DEPOSIT & SETTINGS API ROUTES
`;

    if (!code.includes('const authenticateAdmin')) {
        code = code.replace('// ==========================================\n// NEW DEPOSIT & SETTINGS API ROUTES', authAdminFunc);
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
        await ssh.execCommand('pm2 restart server');
        console.log("Fixed authenticateAdmin and restarted server!");
    } else {
        console.log("authenticateAdmin already exists.");
    }
    
    ssh.dispose();
}
fixAuthAdmin().catch(console.error);
