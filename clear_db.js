const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanDB() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // First, let's see what tables exist
    let res = await ssh.execCommand('sqlite3 /var/www/jmj_app/database.sqlite ".tables"');
    console.log("Tables: ", res.stdout);
    
    // Now delete all users!
    let delRes = await ssh.execCommand('sqlite3 /var/www/jmj_app/database.sqlite "DELETE FROM users;"');
    console.log("Delete Users Result: ", delRes.stdout, delRes.stderr);
    
    ssh.dispose();
}
cleanDB().catch(console.error);
