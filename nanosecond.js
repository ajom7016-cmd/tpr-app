const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Installing compression...");
    await ssh.execCommand("npm install compression", { cwd: '/var/www/jmj_app' });
    
    // Read server.js
    let res = await ssh.execCommand("cat /var/www/jmj_app/server.js");
    let code = res.stdout;
    
    // Add compression middleware
    if (!code.includes("compression()")) {
        code = code.replace(/const express = require\('express'\);/, "const express = require('express');\nconst compression = require('compression');");
        code = code.replace(/const app = express\(\);/, "const app = express();\napp.use(compression());");
        
        let base64Code = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${base64Code}" | base64 -d > /var/www/jmj_app/server.js`);
        await ssh.execCommand("pm2 restart all");
    }
    
    // Inject preload into index.html
    res = await ssh.execCommand("cat /var/www/jmj_app/public/index.html");
    let html = res.stdout;
    
    if (!html.includes('rel="preload" href="/app.html"')) {
        const preloads = `
        <link rel="preload" href="/app.html" as="document">
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" as="style">
        `;
        html = html.replace(/<head>/, `<head>${preloads}`);
        
        let base64Html = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${base64Html}" | base64 -d > /var/www/jmj_app/public/index.html`);
    }
    
    console.log("Super nanosecond speed enabled!");
    ssh.dispose();
}
fix().catch(console.error);
