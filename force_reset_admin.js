const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceResetAdminPass() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');

async function reset() {
    const hash = await bcrypt.hash('admin123', 10);
    db.run("UPDATE users SET password = ? WHERE phone = '01700000000'", [hash], function(err) {
        if(err) console.error(err);
        else console.log("Password reset successfully! Rows affected:", this.changes);
    });
    setTimeout(() => db.close(), 1000);
}
reset();
`;
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/temp_admin_reset.js`);
    
    let res = await ssh.execCommand('node /var/www/jmj_app/temp_admin_reset.js');
    console.log("Output:\n", res.stdout);
    
    ssh.dispose();
}
forceResetAdminPass().catch(console.error);
