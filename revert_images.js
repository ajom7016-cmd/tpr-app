const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function revertImages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Revert optimized images back to original
    html = html.replace(/clean_bg_optimized\.jpg/g, 'clean_bg.jfif');
    html = html.replace(/bg_main_optimized\.jpg/g, 'bg_main.jpg');
    html = html.replace(/cutout_hd_optimized\.png/g, 'cutout_hd.png');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Images reverted in index.html!");
    ssh.dispose();
}
revertImages().catch(console.error);
