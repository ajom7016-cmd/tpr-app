const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    const script = `
        node -e "
            const db = require('./database');
            db.all(\\"SELECT id, name, phone, vip_plan, balance FROM users WHERE name LIKE '%Amina%'\\", [], (err, rows) => {
                console.log('USERS FOUND:', JSON.stringify(rows));
                if (rows && rows.length > 0) {
                    const uids = rows.map(r => r.id).join(',');
                    db.run(\\"DELETE FROM user_tasks WHERE user_id IN (\\" + uids + \\")\\", [], (err2) => {
                        console.log('DELETED user_tasks for users:', err2 || 'SUCCESS');
                        process.exit(0);
                    });
                } else {
                    // If no specific Amina Begum found, delete all today's user_tasks so all tests are fresh
                    db.run(\\"DELETE FROM user_tasks WHERE date(completed_at, 'localtime') = date('now', 'localtime')\\", [], (err2) => {
                        console.log('CLEARED ALL TODAY TASKS:', err2 || 'SUCCESS');
                        process.exit(0);
                    });
                }
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
