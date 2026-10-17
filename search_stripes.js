const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function searchStripes() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r1 = await ssh.execCommand('grep -rn "repeating" /var/www/jmj_app/public/');
    console.log("REPEATING:\n", r1.stdout);
    let r2 = await ssh.execCommand('grep -rn "linear-gradient" /var/www/jmj_app/public/app.html');
    console.log("LINEAR-GRADIENT IN APP.HTML:\n", r2.stdout);
    let r3 = await ssh.execCommand('grep -rn "bg_main_py" /var/www/jmj_app/public/');
    console.log("BG_MAIN_PY:\n", r3.stdout);
    ssh.dispose();
}
searchStripes();
