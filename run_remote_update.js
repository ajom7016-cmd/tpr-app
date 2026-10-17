const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\server_update_admin.js', '/var/www/jmj_app/server_update_admin.js');
    let res = await ssh.execCommand('node /var/www/jmj_app/server_update_admin.js', { cwd: '/var/www/jmj_app' });
    console.log("SERVER EXEC RESULT:\n", res.stdout, res.stderr);

    // Now test login directly via curl
    let testRes = await ssh.execCommand(`curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"contact":"01700000000","password":"admin123"}'`);
    console.log("LOGIN API TEST:\n", testRes.stdout);
    ssh.dispose();
}
run().catch(console.error);
