const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    await ssh.connect({
        host: '104.247.110.22',
        username: 'root',
        password: 'Apple2010@'
    });
    
    // Add bKash for user 30, 33, 34 and ensure their balance is 500 and created_at is 10 days ago
    const script = `
const db = require('./database');
db.all("SELECT id, name, phone, email, balance, vip_plan FROM users WHERE id IN (30, 33, 34, 9, 25)", [], (err, users) => {
    console.log("Found users:", users);
    users.forEach(u => {
        // Ensure bKash exists in user_banks
        db.get("SELECT id FROM user_banks WHERE user_id = ?", [u.id], (err2, b) => {
            if (!b) {
                db.run("INSERT INTO user_banks (user_id, provider, account_number, is_default) VALUES (?, 'bKash', '01870161106', 1)", [u.id], (err3) => {
                    console.log("Added bKash for user", u.id, u.name);
                });
            } else {
                console.log("User already has bank:", u.id, b);
            }
        });
        
        // Ensure created_at passes 3-day withdrawal check and balance is funded
        db.run("UPDATE users SET created_at = datetime('now', '-10 days'), balance = CASE WHEN balance < 500 THEN 550.00 ELSE balance END WHERE id = ?", [u.id]);
    });
    setTimeout(() => {
        console.log("DONE");
        process.exit(0);
    }, 1500);
});
`;
    const res = await ssh.execCommand(`node -e "${script.replace(/\n/g, ' ')}"`, { cwd: '/var/www/jmj_app' });
    console.log(res.stdout || res.stderr);
    ssh.dispose();
}

run();
