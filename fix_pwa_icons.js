const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPWAIcons() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Convert the SVG to PNG using ImageMagick
    console.log("Converting SVG to PNGs...");
    await ssh.execCommand('convert -background none /var/www/jmj_app/public/assets/app-icon.svg -resize 512x512 /var/www/jmj_app/public/assets/app-icon-512.png');
    await ssh.execCommand('convert -background none /var/www/jmj_app/public/assets/app-icon.svg -resize 192x192 /var/www/jmj_app/public/assets/app-icon-192.png');
    
    // 2. Rewrite manifest.json to strictly follow PWA requirements for Chrome
    const manifest = {
      "name": "TPR - The Pet Royal",
      "short_name": "TPR",
      "start_url": "/app.html",
      "display": "standalone",
      "background_color": "#2a2d34",
      "theme_color": "#ea580c",
      "orientation": "portrait",
      "icons": [
        {
          "src": "/assets/app-icon-192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/assets/app-icon-512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    };
    
    let b64m = Buffer.from(JSON.stringify(manifest)).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);
    
    console.log("PWA Icons perfectly fixed!");
    ssh.dispose();
}
fixPWAIcons().catch(console.error);
