const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    conn.exec("node -e \"const sqlite3 = require('sqlite3'); const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite'); db.all('PRAGMA table_info(tasks)', (e, r) => { console.log(JSON.stringify(r, null, 2)); process.exit(0); });\"", (err, stream) => {
        if (err) throw err;
        stream.on('data', d => console.log(d.toString()));
        stream.on('close', () => conn.end());
    });
}).on('error', console.error).connect({
    host: '104.247.110.22',
    port: 22,
    username: 'root',
    password: 'Apple2010@'
});
