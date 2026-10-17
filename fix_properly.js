const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixProperly() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/glassmorphic_3/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("onclick=\\"switchTab('all', this)\\"", "onclick=\\"filterTx('all')\\" id=\\"tab-all\\"");
content = content.replace("onclick=\\"switchTab('deposit', this)\\"", "onclick=\\"filterTx('deposit')\\" id=\\"tab-deposit\\"");
content = content.replace("onclick=\\"switchTab('withdraw', this)\\"", "onclick=\\"filterTx('withdraw')\\" id=\\"tab-withdraw\\"");
content = content.replace("onclick=\\"switchTab('reward', this)\\"", "onclick=\\"filterTx('reward')\\" id=\\"tab-reward\\"");
content = content.replace("onclick=\\"switchTab('referral', this)\\"", "onclick=\\"filterTx('referral')\\" id=\\"tab-referral\\"");

fs.writeFileSync(file, content);
console.log('Fixed buttons inside HTML!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_btn.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_btn.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    ssh.dispose();
}
fixProperly().catch(console.error);
