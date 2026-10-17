const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixNewlineBugAgain() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const files = [
    '/var/www/jmj_app/public/admin.html',
    '/var/www/jmj_app/public/admin2.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace all literal newlines that are inside the prompt string with \\n
    content = content.replace(/currentBal \\+ "\\n/g, 'currentBal + "\\\\n');
    content = content.replace(/লিখুন:\\n/g, 'লিখুন:\\\\n');
    fs.writeFileSync(file, content);
});
console.log('Fixed syntax error AGAIN!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_nl.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_nl.js');
    console.log(res.stdout);
    ssh.dispose();
}
fixNewlineBugAgain();
