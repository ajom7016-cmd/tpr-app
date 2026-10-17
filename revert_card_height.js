const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function revertCardHeight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Revert padding 80px back to 40px
    html = html.replace(/\.part-top-left\s*\{\s*padding:\s*80px\s*40px\s*0px\s*40px;\s*\}/g, 
                        '.part-top-left { padding: 40px 40px 0px 40px; }');
                        
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*80px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 40px 40px; }');
                        
    // The margin-top was -30px. If the card gets shorter, maybe -20px is better for the paw to hang out?
    // Let's leave it at -30px for now, or make it -20px. 
    html = html.replace(/margin-top:\s*-30px;/g, 'margin-top: -20px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card size reverted to original!");
    ssh.dispose();
}
revertCardHeight().catch(console.error);
