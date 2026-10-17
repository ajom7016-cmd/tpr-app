const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function runNodeSql() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    const code = `
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('/var/www/jmj_app/tpr_db.db');
db.all("SELECT vip_plan FROM users LIMIT 5", (err, rows) => {
    console.log(rows);
});
`;
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/check_users.js`);
    let r = await ssh.execCommand('node /var/www/jmj_app/check_users.js');
    console.log(r.stdout);
    ssh.dispose();
}
runNodeSql();
