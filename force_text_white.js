const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceTextWhite() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Purge ALL accidental #1e293b text colors (dark gray text)
    html = html.replace(/color:\s*#1e293b\s*!important;/g, 'color: #ffffff !important;');
    // Purge ALL accidental #475569 text colors (medium gray text)
    html = html.replace(/color:\s*#475569\s*!important;/g, 'color: #cbd5e1 !important;');
    
    // Check if the HTML inline styles have hardcoded dark colors
    html = html.replace(/color: #1e293b;/g, 'color: #ffffff;');
    html = html.replace(/color: #475569;/g, 'color: #cbd5e1;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Forced white text colors!");
    ssh.dispose();
}
forceTextWhite().catch(console.error);
