const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cutMobilePadding() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Remove the rogue padding on .glass-panel in mobile CSS!
    html = html.replace(/\.glass-panel\s*\{\s*width:\s*70%\s*!important;\s*min-height:\s*unset\s*!important;\s*padding:\s*15px\s*0\s*!important;\s*\}/g, 
                        '.glass-panel { width: 70% !important; min-height: unset !important; padding: 0 !important; }');
                        
    // 2. Also fix the .btn-group margin-top which was stubbornly set to 15px !important
    html = html.replace(/margin-top:\s*15px\s*!important;/g, 'margin-top: 5px !important;');
    
    // 3. Since we are removing 15px of padding from the bottom (and top), the card shrinks by 30px.
    // The bottom edge will go UP by 15px.
    // To push it back down to the sofa seat / red line, we need to adjust margin-top.
    // The current margin is -55px. We add 15px -> -40px.
    // But wait, the user said "card take aktu nice namao" (move the card down a little)
    // So let's make it -30px (which pushes it down by 25px total compared to now).
    html = html.replace(/margin-top:\s*-55px;/g, 'margin-top: -30px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Rogue mobile padding cut and card shifted down!");
    ssh.dispose();
}
cutMobilePadding().catch(console.error);
