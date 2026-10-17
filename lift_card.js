const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function liftCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Make the card border 3px thick (mota)
    html = html.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.2\);/g, 
                        'border: 3px solid rgba(255, 255, 255, 0.2);');
    html = html.replace(/border:\s*1px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.1\);/g, 
                        'border: 3px solid rgba(255, 255, 255, 0.2);');
                        
    // 2. Lift it up a little bit (margin-top: -20px)
    html = html.replace(/margin-top:\s*0px;/g, 'margin-top: -25px;');
    // Just in case it was a different margin-top
    html = html.replace(/margin-top:\s*-5px;/g, 'margin-top: -25px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card border made 3px and lifted up by 25px!");
    ssh.dispose();
}
liftCard().catch(console.error);
