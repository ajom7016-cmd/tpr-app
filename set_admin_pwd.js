const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function setPassword() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Run node script directly on the server to hash and save
    const nodeScript = `
    const bcrypt = require('/var/www/jmj_app/node_modules/bcryptjs');
    const sqlite3 = require('/var/www/jmj_app/node_modules/sqlite3').verbose();
    const db = new sqlite3.Database('/var/www/jmj_app/database.sqlite');
    
    const hash = bcrypt.hashSync('admin123', 10);
    db.run("UPDATE users SET password = ? WHERE phone = ?", [hash, '01700000000'], function(err) {
        if(err) console.error(err);
        else console.log('Successfully updated rows:', this.changes);
        db.close();
    });
    `;

    await ssh.execCommand(`node -e "${nodeScript.replace(/\n/g, ' ')}"`);

    // Now test login directly via node-fetch or curl
    let testRes = await ssh.execCommand(`curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"contact":"01700000000","password":"admin123"}'`);
    console.log("CURL TEST RESULT:\n", testRes.stdout);

    ssh.dispose();
}
setPassword().catch(console.error);
