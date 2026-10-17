const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraCompress() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Installing imagemagick in non-interactive mode...");
    let res = await ssh.execCommand('DEBIAN_FRONTEND=noninteractive apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y imagemagick');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    console.log("Compressing clean_bg...");
    res = await ssh.execCommand('convert /var/www/jmj_app/public/clean_bg.jfif -resize 1280x -quality 50 /var/www/jmj_app/public/clean_bg_optimized.jpg');
    
    console.log("Compressing bg_main...");
    res = await ssh.execCommand('convert /var/www/jmj_app/public/assets/bg_main.jpg -resize 800x -quality 50 /var/www/jmj_app/public/assets/bg_main_optimized.jpg');
    
    console.log("Compressing cutout_hd...");
    res = await ssh.execCommand('convert /var/www/jmj_app/public/cutout_hd.png -resize 800x -quality 70 /var/www/jmj_app/public/cutout_hd_optimized.png');
    
    // Update index.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace(/clean_bg\.jfif/g, 'clean_bg_optimized.jpg');
    html = html.replace(/bg_main\.jpg/g, 'bg_main_optimized.jpg');
    html = html.replace(/cutout_hd\.png/g, 'cutout_hd_optimized.png');
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    // Update app.html
    res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appHtml = res.stdout;
    appHtml = appHtml.replace(/bg_main\.jpg/g, 'bg_main_optimized.jpg');
    let b64App = Buffer.from(appHtml).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);

    console.log("Ultra compression applied!");
    ssh.dispose();
}
ultraCompress().catch(console.error);
