const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAnimationDuration() {
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
    
    // Remove the 0.1s override to restore the original 0.6s beautiful staggered animation
    content = content.replace(/animation-duration:\\s*0\\.1s\\s*!important;\\s*\\/\\*.*?\\*\\//g, '');
    content = content.replace(/animation-duration:\\s*0\\.1s\\s*!important;/g, '');
    
    // Also remove the 0.15s override if it exists from earlier
    content = content.replace(/animation-duration:\\s*0\\.15s\\s*!important;/g, '');
    
    fs.writeFileSync(file, content);
});

// Update iframe timestamp to bypass cache
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');
app = app.replace(/const timestamp = '[^']+'; \\/\\/ Fixed version string/, "const timestamp = '" + Date.now() + "'; // Fixed version string");
fs.writeFileSync(appPath, app);

console.log('Restored the original 0.6s staggered animation on ' + htmlFiles.length + ' files.');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_anim_duration.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_anim_duration.js');
    console.log(res.stdout);
    
    await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
    
    ssh.dispose();
}
fixAnimationDuration().catch(console.error);
