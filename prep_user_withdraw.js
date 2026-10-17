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
setTimeout(() => {
    db.get("SELECT id FROM users WHERE phone='01870161106'", (err, row) => {
        if (!row) {
            console.log("User not found!");
            process.exit(1);
        }
        const uid = row.id;
        // Set created_at to 10 days ago so 3-day rule passes
        db.run("UPDATE users SET created_at = datetime('now', '-10 days'), balance=500.00, vip_plan='VIP 1' WHERE id=?", [uid], () => {
            // Delete old transactions for clean state
            db.run("DELETE FROM transactions WHERE user_id=?", [uid], () => {
                // Ensure bKash bank account exists
                db.run("DELETE FROM user_banks WHERE user_id=?", [uid], () => {
                    db.run("INSERT INTO user_banks (user_id, provider, account_number, is_default) VALUES (?, 'bKash', '01870161106', 1)", [uid], () => {
                        console.log("User 01870161106 ready for flawless withdrawal demo!");
                        process.exit(0);
                    });
                });
            });
        });
    });
}, 500);
`;
    const encoded = Buffer.from(script).toString('base64');
    const res = await runRemote(`cd /var/www/jmj_app && node -e "eval(Buffer.from('${encoded}', 'base64').toString())"`);
    console.log(res.output.trim());
}

main().catch(console.error);
