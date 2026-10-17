const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function exposeDb() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Copy the database file to the public folder so the user can download it
    let res = await ssh.execCommand('cp /var/www/jmj_app/database.sqlite /var/www/jmj_app/public/tpr_database_backup.sqlite');
    
    // Also copy it without extension as a backup just in case
    await ssh.execCommand('cp /var/www/jmj_app/database.sqlite /var/www/jmj_app/public/tpr_db.db');
    
    console.log("Database exposed for download.");
    ssh.dispose();
}
exposeDb().catch(console.error);
