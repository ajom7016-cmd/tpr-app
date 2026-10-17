const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function runQuery2() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    const code = `
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/tpr_db.db');
db.all("SELECT id, phone, vip_plan FROM users ORDER BY id DESC LIMIT 5", [], (err, rows) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(rows, null, 2));
    db.close();
});
setTimeout(() => {}, 2000);
`;
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/check_db_direct2.js`);
    let r = await ssh.execCommand('node /var/www/jmj_app/check_db_direct2.js');
    console.log(r.stdout);
    if(r.stderr) console.log("ERR:", r.stderr);
    ssh.dispose();
}
runQuery2();
