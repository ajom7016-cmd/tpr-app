const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreAnimation() {
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
    /* Kill expensive GPU tasks but KEEP animations */
    * {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
    }
    
    /* Make backgrounds solid and clean to save rendering time */
    body, html, .bg-premium-mesh {
        background: #f4f7f9 !important;
        background-image: none !important;
    }

    /* Solid simple glass cards */
    .glass-3d, .glass-card, .glass-panel, .glass-nav, .glass-header, .glass-morphic, .glass-2 {
        background: #ffffff !important;
        background-image: none !important;
        border: 1px solid #e2e8f0 !important;
    }
    
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
    
    // Remove the previous ultra lite block (which had the animation kill code)
    content = content.replace(/<!-- ULTRA LITE MODE FOR LOW END MOBILES -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    // Inject the updated block
    content = content.replace('</head>', ultraLiteStyle + '\\n</head>');
    
    fs.writeFileSync(file, content);
});

console.log('Restored animations while keeping lightweight CSS in ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_anim.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_anim.js');
    console.log(res.stdout);
    
    // Extreme Cache Busting strategy
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
restoreAnimation().catch(console.error);
