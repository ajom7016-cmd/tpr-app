const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function revertZoom() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Revert zoom! We want to SEE the armrests, so 100% is best!
    html = html.replace(/background-size: 140% auto !important;/g, 'background-size: 100% auto !important;');
    
    // Make the card even narrower so it sits BETWEEN the armrests
    html = html.replace(/width: 80% !important;/g, 'width: 70% !important;');
    
    // Change height from 65vw back to 55vw (or maybe 60vw so it has room)
    html = html.replace(/height: 65vw !important;/g, 'height: 60vw !important;');
    
    // Also, reduce padding inside the card so text fits better in a narrower card
    html = html.replace(/padding: 18px 18px 2px 18px !important;/g, 'padding: 12px 12px 0px 12px !important;');
    html = html.replace(/padding: 2px 18px 18px 18px !important;/g, 'padding: 0px 12px 12px 12px !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Zoom reverted, card narrowed to 70%!");
    ssh.dispose();
}
revertZoom().catch(console.error);
