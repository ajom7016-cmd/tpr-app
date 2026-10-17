const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function shrinkCardHeight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Reduce margin-top on .btn-group from 45px to 15px! This saves 30px of height!
    // In style tags:
    html = html.replace(/margin-top:\s*45px;/g, 'margin-top: 15px;');
    
    // 2. Reduce margin-bottom on paragraph from 15px to 10px
    html = html.replace(/margin-bottom:\s*15px;/g, 'margin-bottom: 10px;');
    
    // 3. Since we removed 35px of height, we change margin-top of the card from -60px to -42px.
    // This keeps the bottom perfectly fixed on the sofa seat!
    html = html.replace(/margin-top:\s*-60px;/g, 'margin-top: -42px;');
    
    // 4. Let's make the top padding a tiny bit bigger so text isn't glued to the border
    // Change from 15px to 25px
    html = html.replace(/\.part-top-left\s*\{\s*padding:\s*15px\s*40px\s*0px\s*40px;\s*\}/g, 
                        '.part-top-left { padding: 25px 40px 0px 40px; }');
                        
    // But since we added 10px height back, we need to adjust margin-top to -47px
    html = html.replace(/margin-top:\s*-42px;/g, 'margin-top: -47px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card gaps reduced and positioning balanced!");
    ssh.dispose();
}
shrinkCardHeight().catch(console.error);
