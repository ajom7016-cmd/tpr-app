const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAdminApi() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let code = res.stdout;
    
    // Fix SELECT for admin users
    const oldQuery = 'SELECT id, name, phone, email, balance, role, created_at FROM users ORDER BY created_at DESC';
    const newQuery = 'SELECT id, name, phone, email, balance, role, status, vip_plan, created_at FROM users ORDER BY created_at DESC';
    
    if (code.includes(oldQuery)) {
        code = code.replace(oldQuery, newQuery);
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
    await ssh.execCommand('pm2 restart server');
    
    console.log("Admin API fixed and restarted!");
    ssh.dispose();
}
fixAdminApi().catch(console.error);
