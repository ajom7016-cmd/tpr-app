const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDemo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let html = res.stdout;
    
    if(!html.includes('window.isLandingDemo = true;')) {
        // add it at the top of the body
        html = html.replace('<body>', '<body>\n    <script>window.isLandingDemo = true;</script>');
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
        console.log("Restored isLandingDemo!");
    } else {
        console.log("isLandingDemo exists!");
    }
    ssh.dispose();
}
fixDemo().catch(console.error);
