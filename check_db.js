const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    await ssh.connect({
        host: '104.247.110.22',
        username: 'root',
        password: 'Apple2010@'
    });
    const res = await ssh.execCommand('node -e "const db = require(\'./database\'); db.all(\'SELECT id, name, phone, email FROM users\', [], (e, u) => { console.log(\'USERS:\', u); db.all(\'SELECT * FROM user_banks\', [], (e2, b) => { console.log(\'BANKS:\', b); process.exit(0); }); });"', { cwd: '/var/www/jmj_app' });
    console.log(res.stdout || res.stderr);
    ssh.dispose();
}

run();
