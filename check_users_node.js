const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    conn.exec("cd /var/www/jmj_app && node -e \"const db = require('./database'); db.all('SELECT id, name, email, balance, vip_plan FROM users', (err, rows) => { console.log(JSON.stringify(rows, null, 2)); process.exit(0); });\"", (err, stream) => {
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
            console.log("USERS DB:\n" + out);
            conn.end();
        });
    });
}).connect({
    host: '104.247.110.22',
    port: 22,
    username: 'root',
    password: 'Apple2010@'
});
