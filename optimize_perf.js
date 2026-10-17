const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function optimizePerformance() {
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

const optimizationStyle = \`
<style>
/* PERFORMANCE OPTIMIZATION FOR MOBILE */
@media (max-width: 768px) {
    * {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
    }
    /* Make backgrounds slightly more opaque since we removed blur */
    .glass-3d, .glass-card, .glass-panel, .glass-nav, .glass-header, .glass-morphic {
        background: rgba(255, 255, 255, 0.92) !important;
    }
    .bg-white\\\\/40, .bg-white\\\\/50, .bg-white\\\\/60 {
        background-color: rgba(255, 255, 255, 0.95) !important;
    }
    /* Reduce animation overhead */
    .stagger-root > div {
        animation-duration: 0.3s !important;
    }
}
</style>
\`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('PERFORMANCE OPTIMIZATION FOR MOBILE')) {
        content = content.replace('</head>', optimizationStyle + '\\n</head>');
        fs.writeFileSync(file, content);
    }
});

console.log('Injected mobile performance optimizations into ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/optimize_perf.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/optimize_perf.js');
    console.log(res.stdout);
    
    // Bust cache globally in sw.js and app.html
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
optimizePerformance().catch(console.error);
