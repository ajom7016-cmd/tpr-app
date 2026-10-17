const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function decreaseBottomPadding() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Reduce bottom padding significantly
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*25px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 10px 40px; }');
                        
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Bottom padding decreased!");
    ssh.dispose();
}
decreaseBottomPadding().catch(console.error);
