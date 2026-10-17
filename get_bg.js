const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html');
    let code = r.stdout;
    let bgMatch = code.match(/<div class="bg-premium-mesh"[^>]*>([\\s\\S]*?)<\/div>\s*<\/div>/);
    if(bgMatch) {
        console.log(bgMatch[0]);
    } else {
        console.log("Not found with regex, printing first 2000 chars:");
        console.log(code.substring(0, 2000));
    }
    ssh.dispose();
}
getBg();
