const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixGlassPanel() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Increase desktop glass panel height to make it "mota" (thicker/taller)
    // Find .glass-panel { width: 85%; height: 60%; ... }
    html = html.replace(/height:\s*60%;/, 'height: 75%;');
    
    // Just in case it was a different value
    html = html.replace(/height:\s*65%;/, 'height: 75%;');
    html = html.replace(/height:\s*70%;/, 'height: 75%;');
    
    // If width needs adjusting to perfectly stay inside armrests? 85% looks okay, maybe 82%?
    // "sofar hatoler vitore jeno thake" -> "so that it stays inside the sofa's armrests".
    // I will set width: 82% to give a tiny bit more breathing room from the armrests.
    html = html.replace(/width:\s*85%;/, 'width: 82%;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Glass panel made thicker and fitted inside armrests!");
    ssh.dispose();
}
fixGlassPanel().catch(console.error);
