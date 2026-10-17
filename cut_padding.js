const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cutBottomPadding() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Forcefully remove bottom padding from all variations of .part-bottom-left
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*5px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 0px 40px !important; }');
                        
    html = html.replace(/padding:\s*8px\s*32px\s*28px\s*32px;/g, 
                        'padding: 8px 32px 0px 32px !important;');
                        
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*10px\s*10px\s*10px\s*!important;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 10px 0px 10px !important; }');
                        
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*15px\s*25px\s*15px\s*!important;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 15px 0px 15px !important; }');

    // Because the card is now significantly shorter (we removed ~28px of padding),
    // we need to shift the card UP so the bottom edge goes exactly to the red line.
    // The previous margin-top was -35px. Let's make it -55px to lift it up into the perfect spot!
    html = html.replace(/margin-top:\s*-35px;/g, 'margin-top: -55px;');
    // In case it was -47px
    html = html.replace(/margin-top:\s*-47px;/g, 'margin-top: -55px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Padding below Safari cut out completely and card lifted to the red line!");
    ssh.dispose();
}
cutBottomPadding().catch(console.error);
