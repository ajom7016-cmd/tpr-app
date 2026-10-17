const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findSyntaxError() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Check if my previous script accidentally left a trailing character or removed a closing brace
    const index = html.indexOf('function handleSocialLogin(provider) {');
    const funcStr = html.substring(index, index + 2000);
    console.log("Context around function: \n" + funcStr);
    ssh.dispose();
}
findSyntaxError().catch(console.error);
