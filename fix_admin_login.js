const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    // 1. Update local server.js
    const serverPath = 'C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\server.js';
    let serverCode = fs.readFileSync(serverPath, 'utf8');
    serverCode = serverCode.replace(
        "const { contact, password } = req.body; // contact can be phone or email",
        "const contact = req.body.contact || req.body.phone || req.body.email;\n    const { password } = req.body;"
    );
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log("Updated local server.js");

    // 2. Update local admin.html
    const adminPath = 'C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\admin.html';
    let adminCode = fs.readFileSync(adminPath, 'utf8');
    adminCode = adminCode.replace(
        "body: JSON.stringify({ phone, password })",
        "body: JSON.stringify({ contact: phone, phone, password })"
    );
    fs.writeFileSync(adminPath, adminCode, 'utf8');
    console.log("Updated local admin.html");

    // 3. Connect to SSH
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    // Upload server.js and admin.html
    console.log("Uploading server.js...");
    await ssh.putFile(serverPath, '/var/www/jmj_app/server.js');

    console.log("Uploading admin.html...");
    await ssh.putFile(adminPath, '/var/www/jmj_app/public/admin.html');

    // 4. Update database password for admin
    const newHash = bcrypt.hashSync('admin123', 10);
    const sqlCmd = `python3 -c "import sqlite3; con = sqlite3.connect('/var/www/jmj_app/database.sqlite'); cur = con.cursor(); cur.execute('UPDATE users SET password=\\"${newHash}\\" WHERE phone=\\"01700000000\\"'); con.commit(); con.close(); print('Admin password updated!')"`;
    let res = await ssh.execCommand(sqlCmd);
    console.log("DB RESULT:", res.stdout);

    // 5. Restart PM2
    console.log("Restarting PM2...");
    await ssh.execCommand('pm2 restart all');

    // 6. Test login via curl on server
    console.log("Testing admin login via API...");
    const testCurl = `curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"phone":"01700000000","password":"admin123"}'`;
    let testRes = await ssh.execCommand(testCurl);
    console.log("LOGIN API RESPONSE:\n", testRes.stdout);

    ssh.dispose();
}

run().catch(err => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
});
