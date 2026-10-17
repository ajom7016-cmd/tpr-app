const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function resetAdmin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');
db.all("SELECT phone, password, role FROM users WHERE role = 'admin'", (err, rows) => {
    console.log("Current Admin:", rows);
});
setTimeout(() => db.close(), 1000);
`;
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/temp_admin_check2.js`);
    
    let res = await ssh.execCommand('node /var/www/jmj_app/temp_admin_check2.js');
    console.log("Output:\n", res.stdout);
    
    ssh.dispose();
}
resetAdmin().catch(console.error);
