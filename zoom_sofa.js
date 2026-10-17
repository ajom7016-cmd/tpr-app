const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function zoomSofa() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Zoom the sofa and cutout on mobile!
    // Replace background-size: 100% auto !important; with 140% auto !important;
    html = html.replace(/background-size: 100% auto !important;/g, 'background-size: 140% auto !important;');
    
    // Make the card slightly narrower so the armrests show
    html = html.replace(/width: 87% !important;/g, 'width: 80% !important;');
    
    // The height of hero needs to be taller so the zoomed background isn't cut off too much
    html = html.replace(/height: 55vw !important;/g, 'height: 65vw !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Sofa zoomed and card adjusted!");
    ssh.dispose();
}
zoomSofa().catch(console.error);
