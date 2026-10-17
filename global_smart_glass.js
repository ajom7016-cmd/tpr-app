const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function globalSmartOptimize() {
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
<!-- GLOBAL SMART PERFORMANCE OPTIMIZATION -->
<style>
/* Applied to BOTH Laptop and Mobile so you can feel the speed instantly */

/* 1. Reduce the mathematical complexity of the blur (40px -> 8px) globally */
/* It keeps the premium glass look but takes almost zero processing power */
.glass-card, .list-card, .action-box, .tpr-logo-box, .glass-3d, .glass-panel, .glass-nav, .glass-header, .glass-morphic {
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
}

/* 2. Force hardware acceleration for animations and make them BLAZING FAST */
body > main > *, body > div > *, .popUpStagger, .stagger-root > div {
    will-change: transform, opacity;
    animation-duration: 0.1s !important; /* Super snappy 0.1s */
}

/* 3. Hide the heavy background mesh aura completely, keeping a clean solid background */
.aura-bg, .bg-premium-mesh {
    display: none !important;
}
</style>
\`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove the previous mobile-only block
    content = content.replace(/<!-- SMART GLASS OPTIMIZATION FOR 1GB RAM MOBILES -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    // Remove if previously injected (idempotency)
    content = content.replace(/<!-- GLOBAL SMART PERFORMANCE OPTIMIZATION -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    content = content.replace('</head>', smartStyle + '\\n</head>');
    fs.writeFileSync(file, content);
});

// Update iframe timestamp to bypass cache
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

console.log('Injected GLOBAL Smart Glass optimizations into ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/global_smart_glass.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/global_smart_glass.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
globalSmartOptimize().catch(console.error);
