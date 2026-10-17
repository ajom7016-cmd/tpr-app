const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function seedTasks() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');
db.serialize(() => {
    db.run("INSERT OR IGNORE INTO tasks (id, title, description, reward, type) VALUES (1, 'YouTube Video', 'Watch YouTube Video', 10, 'youtube')");
    db.run("INSERT OR IGNORE INTO tasks (id, title, description, reward, type) VALUES (2, 'Facebook Page', 'Follow Facebook Page', 10, 'facebook')");
    db.run("INSERT OR IGNORE INTO tasks (id, title, description, reward, type) VALUES (3, 'Telegram Channel', 'Join Telegram Channel', 10, 'telegram')");
    db.run("INSERT OR IGNORE INTO tasks (id, title, description, reward, type) VALUES (4, 'TikTok Follow', 'Follow TikTok Profile', 10, 'tiktok')");
});
setTimeout(() => db.close(), 1000);
`;
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/temp_seed_tasks.js`);
    
    let res = await ssh.execCommand('node /var/www/jmj_app/temp_seed_tasks.js');
    console.log("Output:\n", res.stdout);
    
    // Check if it worked
    const checkScript = `
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');
db.all("SELECT * FROM tasks", (err, rows) => {
    console.log("Tasks after seed:", rows);
});
setTimeout(() => db.close(), 1000);
`;
    let b64Check = Buffer.from(checkScript).toString('base64');
    await ssh.execCommand(`echo "${b64Check}" | base64 -d > /var/www/jmj_app/temp_check.js`);
    let res2 = await ssh.execCommand('node /var/www/jmj_app/temp_check.js');
    console.log("Check:\n", res2.stdout);
    
    ssh.dispose();
}
seedTasks().catch(console.error);
