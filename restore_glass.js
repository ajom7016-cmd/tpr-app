const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreGlassDesign() {
    let connected = false;
    for(let i=0; i<3; i++) {
        try {
            await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@', readyTimeout: 10000 });
            connected = true; break;
        } catch(e) { console.log('retry SSH...'); }
    }
    if(!connected) return console.log('SSH failed');

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
    
    // Completely remove the Ultra Lite optimization block
    content = content.replace(/<!-- ULTRA LITE MODE FOR LOW END MOBILES -->[\\s\\S]*?<\\/style>\\s*/, '');
    
    fs.writeFileSync(file, content);
});

console.log('Restored the original beautiful glassmorphic design in ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/restore_glass.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/restore_glass.js');
    console.log(res.stdout);
    
    // Bust cache globally
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
restoreGlassDesign().catch(console.error);
