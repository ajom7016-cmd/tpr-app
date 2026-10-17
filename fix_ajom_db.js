const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAjom() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('/var/www/jmj_app/node_modules/sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');

db.serialize(() => {
    // Find the user and reset their task so they can test the fix
    db.all("SELECT * FROM users WHERE name LIKE '%AJOM%' COLLATE NOCASE", (err, users) => {
        if(users && users.length > 0) {
            const user = users[0];
            // Remove the 10 TK he earned from the bug
            db.run("UPDATE users SET balance = balance - 10 WHERE id = ?", [user.id]);
            // Delete his tasks for today so he can do it again and get 50 TK!
            db.run("DELETE FROM user_tasks WHERE user_id = ?", [user.id]);
            // Also delete the transaction record so history is clean
            db.run("DELETE FROM transactions WHERE user_id = ? AND type = 'reward'", [user.id]);
            console.log('Reset user AJOM to let him test the 50 TK fix!');
        } else {
            console.log('User AJOM not found.');
        }
    });
});
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_ajom.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_ajom.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixAjom().catch(console.error);
