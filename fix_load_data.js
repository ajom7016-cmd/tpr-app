const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixLoadData() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/admin.html');
    let code = res.stdout;
    
    // Fix loadAllData function
    if (!code.includes('await fetchSettings();')) {
        code = code.replace('await fetchWithdrawals();', 'await fetchWithdrawals();\n            await fetchDeposits();\n            await fetchSettings();');
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/admin.html`);
        console.log("Fixed loadAllData!");
    } else {
        console.log("Already fixed.");
    }
    ssh.dispose();
}
fixLoadData().catch(console.error);
