const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixFooter() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Inject background-color: #0a0a0a; into the inline style of the footer
    html = html.replace(
        '<div class="footer" style="display: flex;', 
        '<div class="footer" style="background-color: #07070a; display: flex;'
    );
    
    // Let's also make sure the padding looks good if the background is solid black
    // It already has padding: 30px 60px;
    
    const b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Footer is now black!");
    ssh.dispose();
}
fixFooter().catch(console.error);
