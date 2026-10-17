const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function makeUltraLite() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getAllHtmlFiles('/var/www/jmj_app/public');

const ultraLiteStyle = \`
<!-- ULTRA LITE MODE FOR LOW END MOBILES -->
<style>
@media (max-width: 768px) {
    /* 1. Kill all expensive CSS rendering */
    * {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
    
    /* 2. Make animations and transitions instant (0 seconds) to save CPU/GPU cycle */
    *, *::before, *::after {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
        transition-delay: 0s !important;
    }

    /* 3. Strip out heavy gradient/mesh backgrounds and replace with solid lightweight colors */
    body, html, .bg-premium-mesh {
        background: #f4f7f9 !important;
        background-image: none !important;
    }

    /* 4. Make all 'glass' cards solid white with a simple 1px border instead of shadow */
    .glass-3d, .glass-card, .glass-panel, .glass-nav, .glass-header, .glass-morphic, .glass-2 {
        background: #ffffff !important;
        background-image: none !important;
        border: 1px solid #e2e8f0 !important;
    }
    
    /* Nav bar specific border fix */
    .glass-nav { 
        border-top: 1px solid #e2e8f0 !important; 
        border-bottom: none !important; 
        border-left: none !important; 
        border-right: none !important; 
    }
}
</style>
\`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the previous optimization block
    content = content.replace(/<style>\\s*\\/\\* PERFORMANCE OPTIMIZATION FOR MOBILE \\*\\/[\\s\\S]*?<\\/style>\\s*/, '');
    
    // Remove if this new block is already there (for idempotency)
    content = content.replace(/<!-- ULTRA LITE MODE FOR LOW END MOBILES -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    // Inject the new Ultra Lite block
    content = content.replace('</head>', ultraLiteStyle + '\\n</head>');
    
    fs.writeFileSync(file, content);
});

console.log('Injected ULTRA LITE performance optimizations into ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/ultra_lite.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/ultra_lite.js');
    console.log(res.stdout);
    
    // Bust cache globally in sw.js
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
makeUltraLite().catch(console.error);
