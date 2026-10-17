const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanTasksClean() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const sqlite3 = require('/var/www/jmj_app/node_modules/sqlite3').verbose();
const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');
db.run("DELETE FROM tasks WHERE title NOT IN ('YouTube Video', 'Facebook Page', 'Telegram Channel', 'TikTok Follow')");
setTimeout(() => db.close(), 500);
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/clean_db.js`);
    await ssh.execCommand('node /var/www/jmj_app/clean_db.js');
    console.log("Deleted extra tasks.");
    ssh.dispose();
}
cleanTasksClean().catch(console.error);
