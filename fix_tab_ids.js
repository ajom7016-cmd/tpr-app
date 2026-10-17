const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTabIDs() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // Fix buttons
    code = code.replace('id="tab-deposit" class="w-full', 'id="nav-deposit" class="nav-btn w-full');
    code = code.replace('id="tab-settings" class="w-full', 'id="nav-settings" class="nav-btn w-full');
    
    // Fix content divs
    code = code.replace('id="deposit-content" class="hide"', 'id="tab-deposit" class="hide tab-content"');
    code = code.replace('id="settings-content" class="hide"', 'id="tab-settings" class="hide tab-content"');
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
    console.log("Fixed Tab IDs and Classes!");
    ssh.dispose();
}
fixTabIDs().catch(console.error);
