const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('node -e "const sqlite3 = require(\'sqlite3\'); const bcrypt = require(\'bcryptjs\'); const db = new sqlite3.Database(\'database.sqlite\'); bcrypt.hash(\'123456\', 10, (err, hash) => { db.run(\'UPDATE users SET password = ? WHERE email = ?\', [hash, \'ajom7016@gmail.com\'], (err) => { console.log(\'Password updated\'); }); });"', {cwd: '/var/www/jmj_app'});
    console.log(res.stdout, res.stderr);
    ssh.dispose();
}
fix();
