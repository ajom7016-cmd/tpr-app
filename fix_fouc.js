const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixFOUC() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const styleBlock = `
    <!-- FOUC Fix for Tailwind CDN -->
    <style>
        body { opacity: 0; animation: fadeBodyIn 0.4s ease-out forwards; animation-delay: 200ms; background-color: #eef2f6; }
        @keyframes fadeBodyIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>`;

    // Fix app.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let code = res.stdout;
    if(code.includes('</head>')) {
        code = code.replace('</head>', styleBlock);
        
        // Ensure body has background color in case tailwind fails
        code = code.replace('<body>', '<body class="bg-[#eef2f6]">');
        
        // Bump cache
        code = code.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.14';");
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/app.html`);
    }

    // Fix login.html
    const styleBlockLogin = `
    <!-- FOUC Fix for Tailwind CDN -->
    <style>
        body { opacity: 0; animation: fadeBodyIn 0.4s ease-out forwards; animation-delay: 150ms; }
        @keyframes fadeBodyIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>`;
    let resLogin = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let loginCode = resLogin.stdout;
    if(loginCode.includes('</head>')) {
        loginCode = loginCode.replace('</head>', styleBlockLogin);
        let b64Login = Buffer.from(loginCode).toString('base64');
        await ssh.execCommand(`echo "${b64Login}" | base64 -d > /var/www/jmj_app/public/login.html`);
    }
    
    // Bump SW cache
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v16');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);

    console.log("FOUC (Layout Shift) fixed globally using CSS Delay Animation!");
    ssh.dispose();
}
fixFOUC().catch(console.error);
