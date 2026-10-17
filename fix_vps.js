const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Rename index.html to app.html
    await ssh.execCommand('mv /var/www/jmj_app/public/index.html /var/www/jmj_app/public/app.html');
    // Rename landing.html to index.html
    await ssh.execCommand('mv /var/www/jmj_app/public/landing.html /var/www/jmj_app/public/index.html');
    
    // Also we need to update the iframe in the new index.html (landing) to point to /app.html instead of /index.html
    await ssh.execCommand("sed -i 's/src=\\'\\/index.html\\'/src=\\'\\/app.html\\'/g' /var/www/jmj_app/public/index.html");
    
    console.log("Renamed successfully on VPS.");
    ssh.dispose();
}
fix().catch(console.error);
