const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function createTables() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('/var/www/jmj_app/node_modules/sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');

db.serialize(() => {
    db.run(\`CREATE TABLE IF NOT EXISTS deposits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL,
        method TEXT,
        transaction_id TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )\`);

    db.run(\`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        amount REAL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )\`);
    
    db.run(\`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )\`);
});

console.log('Tables created successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/create_tables.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/create_tables.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    ssh.dispose();
}
createTables().catch(console.error);
