const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanDBNode() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("DELETE FROM users", function(err) {
        if (err) console.error(err);
        else console.log("Deleted " + this.changes + " users from database.");
    });
    db.run("DELETE FROM transactions", function(err) {});
    db.run("DELETE FROM tasks", function(err) {});
});
db.close();
`;
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/delete_users.js`);
    
    let res = await ssh.execCommand('node /var/www/jmj_app/delete_users.js', { cwd: '/var/www/jmj_app' });
    console.log("Result: ", res.stdout, res.stderr);
    
    ssh.dispose();
}
cleanDBNode().catch(console.error);
