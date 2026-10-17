const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixGlassVisibility() {
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

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // The issue is this specific rule in my global optimization block:
    // .aura-bg, .bg-premium-mesh { display: none !important; }
    // We need to remove this rule so the colorful background comes back, making the glass visible!
    content = content.replace(/\\.aura-bg, \\.bg-premium-mesh \\{\\s*display: none !important;\\s*\\}/g, '');
    
    fs.writeFileSync(file, content);
});

// Update iframe timestamp to bypass cache
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

console.log('Restored background meshes to make glass visible again.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_bg_mesh.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_bg_mesh.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixGlassVisibility().catch(console.error);
