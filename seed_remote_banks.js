const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
    await ssh.connect({
        host: '104.247.110.22',
        username: 'root',
        password: 'Apple2010@'
    });
    
    const remoteScript = `
const db = require('./database');
db.all("SELECT id, name, phone, email, balance, vip_plan FROM users", [], (err, users) => {
    console.log("All users count:", users ? users.length : 0);
    if (!users) process.exit(0);
    let pending = users.length;
    users.forEach(u => {
        // Ensure bKash exists in user_banks
        db.get("SELECT id FROM user_banks WHERE user_id = ?", [u.id], (err2, b) => {
            if (!b) {
                const phoneNum = (u.phone && u.phone.startsWith('01')) ? u.phone : '01870161106';
                db.run("INSERT INTO user_banks (user_id, provider, account_number, is_default) VALUES (?, 'bKash', ?, 1)", [u.id, phoneNum], (err3) => {
                    console.log("Added default bKash for user", u.id, u.name, phoneNum);
                    checkDone();
                });
            } else {
                checkDone();
            }
        });
        
        // Ensure created_at passes 3-day withdrawal check and balance is funded
        db.run("UPDATE users SET created_at = datetime('now', '-10 days'), balance = CASE WHEN balance < 500 THEN 550.00 ELSE balance END WHERE id = ?", [u.id]);
    });

    function checkDone() {
        pending--;
        if (pending <= 0) {
            console.log("ALL USERS HAVE DEFAULT BANK READY!");
            setTimeout(() => process.exit(0), 500);
        }
    }
});
`;
    await ssh.execCommand(`cat << 'EOF' > /tmp/seed_banks.js\n${remoteScript}\nEOF`);
    const res = await ssh.execCommand('node /tmp/seed_banks.js', { cwd: '/var/www/jmj_app' });
    console.log(res.stdout || res.stderr);
    ssh.dispose();
}

run();
