const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixNewlineBug() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const files = [
    '/var/www/jmj_app/public/admin.html',
    '/var/www/jmj_app/public/admin2.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace the literal newline with \\n
    content = content.replace('Balance: ৳" + currentBal + "\\nType \\'add\\'', 'Balance: ৳" + currentBal + "\\\\nType \\'add\\'');
    fs.writeFileSync(file, content);
});
console.log('Fixed syntax error in admin HTML files!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_newline_bug.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_newline_bug.js');
    console.log(res.stdout);
    ssh.dispose();
}
fixNewlineBug();
