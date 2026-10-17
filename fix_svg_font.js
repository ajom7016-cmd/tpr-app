const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSVGText() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read the SVG
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/assets/app-icon.svg');
    let svg = res.stdout;
    
    // Replace Montserrat with generic sans-serif and fix letter-spacing so it doesn't overlap
    svg = svg.replace(/font-family="Montserrat, Arial, sans-serif"/g, 'font-family="DejaVu Sans, sans-serif"');
    svg = svg.replace(/letter-spacing="-1"/g, 'letter-spacing="0"');
    
    // Save SVG
    let b64 = Buffer.from(svg).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/assets/app-icon.svg`);
    
    // Re-convert to PNG
    await ssh.execCommand('convert -background none /var/www/jmj_app/public/assets/app-icon.svg -resize 512x512 /var/www/jmj_app/public/assets/app-icon-512.png');
    await ssh.execCommand('convert -background none /var/www/jmj_app/public/assets/app-icon.svg -resize 192x192 /var/www/jmj_app/public/assets/app-icon-192.png');
    
    console.log("SVG Font fixed and PNGs regenerated!");
    ssh.dispose();
}
fixSVGText().catch(console.error);
