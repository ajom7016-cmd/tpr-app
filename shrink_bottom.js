const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function shrinkBottomArea() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Reduce margin-top on .btn-group to 5px
    html = html.replace(/margin-top:\s*15px;/g, 'margin-top: 5px;');
    // In case it was still 45px for some reason:
    html = html.replace(/margin-top:\s*45px;/g, 'margin-top: 5px;');
    
    // 2. Reduce margin-bottom on paragraph to 5px
    html = html.replace(/margin-bottom:\s*10px;/g, 'margin-bottom: 5px;');
    html = html.replace(/margin-bottom:\s*15px;/g, 'margin-bottom: 5px;');
    
    // 3. Reduce Open in Safari margin-top. It matches the 15px replace above, but just in case:
    // (the first replace /margin-top: 15px;/g caught both .btn-group if it was 15, and the Safari button wrapper!)
    
    // 4. Reduce bottom padding on .part-bottom-left to 5px
    html = html.replace(/\.part-bottom-left\s*\{\s*padding:\s*0px\s*40px\s*10px\s*40px;\s*\}/g, 
                        '.part-bottom-left { padding: 0px 40px 5px 40px; }');
                        
    // 5. Adjust margin-top of the card to keep the bottom edge locked to the sofa seat.
    // If we removed ~25px of height, the bottom edge went UP by 12.5px.
    // So we shift the card down by ~12px. (-47px + 12px = -35px)
    html = html.replace(/margin-top:\s*-47px;/g, 'margin-top: -35px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Bottom area padding completely squashed!");
    ssh.dispose();
}
shrinkBottomArea().catch(console.error);
