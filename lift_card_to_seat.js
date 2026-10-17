const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function liftCardToSeat() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Lift the entire card UP significantly so its bottom edge rests on the sofa seat
    html = html.replace(/margin-top:\s*5px;/g, 'margin-top: -60px;');

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card lifted up to the sofa seat!");
    ssh.dispose();
}
liftCardToSeat().catch(console.error);
