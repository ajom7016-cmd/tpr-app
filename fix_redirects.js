const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Replace /index.html with /app.html in login.html and mock_oauth.html
    await ssh.execCommand("sed -i 's/\\/index.html/\\/app.html/g' /var/www/jmj_app/public/login.html");
    await ssh.execCommand("sed -i 's/\\/index.html/\\/app.html/g' /var/www/jmj_app/public/mock_oauth.html");
    
    // Also landing.html was renamed to index.html, so any link inside the new index.html to /index.html should be /app.html too
    // (for the "Explore Web App" links)
    await ssh.execCommand("sed -i 's/\\/index.html/\\/app.html/g' /var/www/jmj_app/public/index.html");

    console.log("Fixed redirects!");
    ssh.dispose();
}
fix().catch(console.error);
