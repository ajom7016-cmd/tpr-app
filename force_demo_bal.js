const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceDemoBalance() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html');
    let html = res.stdout;
    
    // Explicitly enforce demo data if it's a demo
    html = html.replace(
        'const profile = await window.APP.getProfile();',
        `let profile = await window.APP.getProfile();
         if ((window.isLandingDemo || (window.parent && window.parent.isLandingDemo))) {
             profile = {
                 id: 9999,
                 phone: "01700000000",
                 balance: 845600.50,
                 vip_plan: "VIP 5",
                 avatar_url: "https://i.pravatar.cc/300?u=a042581f4e29026704d",
                 created_at: new Date().toISOString()
             };
         }`
    );
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_1/code.html`);
    console.log("Forced Demo Balance applied to code.html!");
    ssh.dispose();
}
forceDemoBalance().catch(console.error);
