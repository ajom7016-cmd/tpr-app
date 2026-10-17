const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bulletproofFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Download the file to local
    await ssh.getFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/server_bulletproof.js', '/var/www/jmj_app/server.js');
    console.log("Downloaded server.js");
    
    // Read and fix locally
    const fs = require('fs');
    let content = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/server_bulletproof.js', 'utf8');
    
    // Force replace all "{ 0: 10" with "{ 0: 50"
    content = content.split('{ 0: 10,').join('{ 0: 50,');
    
    fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/server_bulletproof.js', content);
    console.log("Fixed locally.");
    
    // Upload back
    await ssh.putFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/server_bulletproof.js', '/var/www/jmj_app/server.js');
    console.log("Uploaded fixed server.js!");
    
    // Restart PM2
    let res = await ssh.execCommand('pm2 restart jmj_app');
    console.log("PM2 Restarted: ", res.stdout);
    
    // Now for frontend
    await ssh.getFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/front_bulletproof.html', '/var/www/jmj_app/public/glassmorphic_2/code.html');
    let front = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/front_bulletproof.html', 'utf8');
    front = front.split('{ 0: 10,').join('{ 0: 50,');
    fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/front_bulletproof.html', front);
    await ssh.putFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/front_bulletproof.html', '/var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("Fixed frontend tasks HTML.");
    
    // Now fix app.html cache bump
    await ssh.getFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/app_bulletproof.html', '/var/www/jmj_app/public/app.html');
    let app = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/app_bulletproof.html', 'utf8');
    app = app.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.55'");
    fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/app_bulletproof.html', app);
    await ssh.putFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/app_bulletproof.html', '/var/www/jmj_app/public/app.html');
    
    // Bump SW
    let swRes = await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v41\\'/g' /var/www/jmj_app/public/sw.js");
    console.log("Cache bumped.");

    ssh.dispose();
}
bulletproofFix().catch(console.error);
