const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function compressImages() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Installing imagemagick...");
    let res = await ssh.execCommand('apt-get update && apt-get install -y imagemagick');
    console.log(res.stdout);
    
    console.log("Compressing clean_bg.jfif...");
    res = await ssh.execCommand('convert /var/www/jmj_app/public/clean_bg.jfif -resize 1920x -quality 60 /var/www/jmj_app/public/clean_bg_optimized.jpg');
    console.log(res.stderr);
    
    // Also optimize bg_main.jpg just in case
    console.log("Compressing bg_main.jpg...");
    res = await ssh.execCommand('convert /var/www/jmj_app/public/assets/bg_main.jpg -resize 1080x -quality 60 /var/www/jmj_app/public/assets/bg_main_optimized.jpg');
    
    // Now update index.html to use the new optimized images, AND increase preloader fallback time
    res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    html = html.replace(/clean_bg\.jfif/g, 'clean_bg_optimized.jpg');
    html = html.replace(/bg_main\.jpg/g, 'bg_main_optimized.jpg');
    
    // Fix preloader
    html = html.replace('setTimeout(hidePreloader, 1500); // Bulletproof fallback', 'setTimeout(hidePreloader, 8000); // Wait up to 8s for images to load');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    console.log("Images compressed and index.html updated!");
    ssh.dispose();
}
compressImages().catch(console.error);
