const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function enforce10Days() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let code = res.stdout;
    
    // Inject the 10-day check right after user is retrieved in /api/tasks/complete
    const targetString = "if (err || !user) return res.status(404).json({ error: 'User not found' });";
    
    const newCheck = `
            if (err || !user) return res.status(404).json({ error: 'User not found' });
            
            // Free plan 10-day limit check
            if (user.vip_plan === 'Free') {
                const createdAt = new Date(user.created_at + 'Z'); // UTC
                const now = new Date();
                const diffTime = Math.abs(now - createdAt);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 10) {
                    return res.status(403).json({ error: 'আপনার ফ্রি প্ল্যানের মেয়াদ ১০ দিন শেষ হয়ে গেছে। দয়া করে VIP কিনুন!' });
                }
            }
`;
    
    if(code.includes(targetString)) {
        code = code.replace(targetString, newCheck);
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/server.js`);
        await ssh.execCommand('pm2 restart server');
        console.log("10-day limit applied!");
    } else {
        console.log("Could not find target string.");
    }
    
    ssh.dispose();
}
enforce10Days().catch(console.error);
