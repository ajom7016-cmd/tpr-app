const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function smartGlassOptimize() {
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

const smartStyle = \`
<!-- SMART GLASS OPTIMIZATION FOR 1GB RAM MOBILES -->
<style>
@media (max-width: 768px) {
    /* 1. Reduce the mathematical complexity of the blur (40px -> 12px) and remove saturate */
    /* It still looks like glass, but takes 80% less processing power */
    .glass-card, .list-card, .action-box, .tpr-logo-box, .glass-3d, .glass-panel, .glass-nav, .glass-header {
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
    }
    
    /* 2. Force hardware acceleration for animations to stop stuttering */
    body > main > *, body > div > *, .popUpStagger {
        will-change: transform, opacity;
        /* Make animations snappy again */
        animation-duration: 0.15s !important;
    }
    
    /* 3. Hide the heavy background mesh aura on mobile only, keeping a clean background */
    .aura-bg, .bg-premium-mesh {
        display: none !important;
    }
}
</style>
\`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove if previously injected
    content = content.replace(/<!-- SMART GLASS OPTIMIZATION FOR 1GB RAM MOBILES -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    content = content.replace('</head>', smartStyle + '\\n</head>');
    fs.writeFileSync(file, content);
});

// Update iframe timestamp to bypass cache
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

console.log('Injected Smart Glass optimizations into ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/smart_glass.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/smart_glass.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
smartGlassOptimize().catch(console.error);
