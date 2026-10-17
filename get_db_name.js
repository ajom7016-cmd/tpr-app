const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function testAPI() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand(`
        cat << 'EOF' > /var/www/jmj_app/test_api.js
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('/var/www/jmj_app/tpr_db.db'); // Is it tpr_db.db or database.sqlite? Let's check server.js
EOF
        cat /var/www/jmj_app/server.js | grep "sqlite3.Database"
    `);
    console.log(res.stdout);
    ssh.dispose();
}
testAPI();
