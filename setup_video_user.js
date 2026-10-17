const { Client } = require('ssh2');

function runRemote(cmd) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        let output = '';
        conn.on('ready', () => {
            conn.exec(cmd, (err, stream) => {
                if (err) return reject(err);
                stream.on('close', (code) => {
                    conn.end();
                    resolve({ code, output });
                }).on('data', data => {
                    output += data.toString();
                }).stderr.on('data', data => {
                    output += data.toString();
                });
            });
        }).on('error', reject).connect({
            host: '104.247.110.22',
            port: 22,
            username: 'root',
            password: 'Apple2010@'
        });
    });
}

async function main() {
    const script = `
const db = require('./database');
const bcrypt = require('bcryptjs');

setTimeout(async () => {
    const hash = await bcrypt.hash('123456', 10);
    db.get("SELECT id FROM users WHERE phone='01870161106'", (err, row) => {
        if (row) {
            db.run("UPDATE users SET name='Amina Begum', password=?, balance=500.00, vip_plan='VIP 1', total_tasks=0 WHERE id=?", [hash, row.id], (e) => {
                console.log("Updated user 01870161106 to VIP 1 with Tk 500 balance");
                // Clear any task logs for today
                db.run("DELETE FROM user_tasks WHERE user_id=?", [row.id], () => process.exit(0));
            });
        } else {
            db.run("INSERT INTO users (name, phone, email, password, balance, vip_plan, role) VALUES ('Amina Begum', '01870161106', 'amina1106@thepetroyal.com', ?, 500.00, 'VIP 1', 'user')", [hash], function(e) {
                console.log("Created user 01870161106 with ID", this.lastID);
                process.exit(0);
            });
        }
    });
}, 500);
`;

    const encoded = Buffer.from(script).toString('base64');
    const res = await runRemote(`cd /var/www/jmj_app && node -e "eval(Buffer.from('${encoded}', 'base64').toString())"`);
    console.log("Setup User Result:", res.output.trim());
}

main().catch(console.error);
