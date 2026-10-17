const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function perfectCardHeight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Revert the border back to 1px
    html = html.replace(/border:\s*3px\s*solid\s*rgba\(255,\s*255,\s*255,\s*0\.2\);/g, 
                        'border: 1px solid rgba(255, 255, 255, 0.1);');
                        
    // 2. Make the card significantly taller (top and bottom) to look perfect
    // Currently: .part-top-left { padding: 50px 40px 0px 40px; }
    // Let's make it 80px!
    html = html.replace(/\.part-top-left\s*\{\s*padding:\s*50px\s*40px\s*0px\s*40px;\s*\}/g, 
                        '.part-top-left { padding: 80px 40px 0px 40px; }');
                        
    // Currently: .part-bottom-left { padding: 0px 40px 50px 40px; }
    // Let's make it 80px!
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*50px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 80px 40px; }');

    // 3. Keep the lift, but maybe refine it to -30px so it sits perfectly.
    html = html.replace(/margin-top:\s*-25px;/g, 'margin-top: -30px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card height made perfectly taller and border reverted!");
    ssh.dispose();
}
perfectCardHeight().catch(console.error);
