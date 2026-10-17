const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    // Reset today_tasks for Amina Begum or all users
    const script = `
        node -e "
            const db = require('./database');
            db.all(\\"SELECT id, name, phone, vip_plan, today_tasks, balance FROM users WHERE name LIKE '%Amina%' OR today_tasks > 0\\", [], (err, rows) => {
                console.log('BEFORE RESET:', JSON.stringify(rows));
                db.run(\\"UPDATE users SET today_tasks = 0 WHERE name LIKE '%Amina%' OR today_tasks > 0\\", [], (err2) => {
                    console.log('RESET DONE:', err2 || 'SUCCESS');
                    db.all(\\"SELECT id, name, phone, vip_plan, today_tasks, balance FROM users WHERE name LIKE '%Amina%'\\", [], (err3, rows2) => {
                        console.log('AFTER RESET:', JSON.stringify(rows2));
                        process.exit(0);
                    });
                });
            });
        "
    `;

    conn.exec(`cd /var/www/jmj_app && ${script}`, (err, stream) => {
        if (err) throw err;
        let out = '';
        stream.on('close', () => {
            console.log(out);
            conn.end();
        }).on('data', d => out += d).stderr.on('data', d => out += d);
    });
}).on('error', err => console.error(err)).connect({
    host: '104.247.110.22',
    port: 22,
    username: 'root',
    password: 'Apple2010@'
});
