const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixToken() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/deposit_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/localStorage\.getItem\\('token'\\)/g, "localStorage.getItem('userToken')");

fs.writeFileSync(file, content);
console.log('Fixed token successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_token2.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_token2.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixToken().catch(console.error);
