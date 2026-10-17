const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    conn.exec("sqlite3 /var/www/jmj_app/database.sqlite 'SELECT id, name, email, balance, vip_plan FROM users;'", (err, stream) => {
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
