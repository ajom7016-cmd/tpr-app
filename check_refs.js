const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
    conn.exec("cd /var/www/jmj_app && node -e \"const sqlite3 = require('sqlite3').verbose(); const db = new sqlite3.Database('./database.sqlite'); db.all('SELECT id, name, phone, email, referral_code, referred_by, total_referrals FROM users ORDER BY id DESC', (err, rows) => { if(err) console.error(err); else console.log(JSON.stringify(rows, null, 2)); });\"", (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('data', d => out += d);
        stream.on('close', () => {
            console.log('VPS Users:\n' + out);
            conn.end();
        });
    });
}).connect({ host: '104.247.110.22', port: 22, username: 'root', password: 'Apple2010@' });
