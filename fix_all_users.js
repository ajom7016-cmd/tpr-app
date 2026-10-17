const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAllUsers() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('/var/www/jmj_app/node_modules/sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');

db.serialize(() => {
    // Find ALL users with VIP 'Free' whose balance is 10 TK (meaning they did the bugged task today)
    db.all("SELECT * FROM users WHERE vip_plan = 'Free' AND balance = 10", (err, users) => {
        if(users && users.length > 0) {
            users.forEach(user => {
                // Update their balance to 50 TK by adding the missing 40 TK
                db.run("UPDATE users SET balance = balance + 40 WHERE id = ?", [user.id]);
                // Also update the transaction record if it exists
                db.run("UPDATE transactions SET amount = 50 WHERE user_id = ? AND amount = 10 AND type = 'reward'", [user.id]);
                console.log('Fixed balance for user:', user.name);
            });
            console.log('Compensated ' + users.length + ' users!');
        } else {
            console.log('No users found with 10 TK balance.');
        }
    });
    
    // Also, just to be super safe, clear task limits for ALL Free users today so they can all try again
    db.run("DELETE FROM user_tasks WHERE user_id IN (SELECT id FROM users WHERE vip_plan = 'Free')");
    console.log('Cleared task limits for all Free users so they can test the fix!');
});
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_all.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_all.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixAllUsers().catch(console.error);
