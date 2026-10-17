const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraFast() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Rewrite loadPage to be instantaneous
const oldLoadBlockRegex = /if \\(frame\\.src\\) \\{[\\s\\S]*?else \\{/m;
const newLoadBlock = \`if (frame.src) {
            // No fade out, no delays, instant fetch!
            const loader = document.getElementById('frame-loader');
            if(loader) loader.style.display = 'none';
            frame.style.transform = 'translateY(5px)'; // Very tiny bump for feedback
            frame.style.opacity = '0.7';
            frame.src = finalUrl;
        } else {\`;
        
content = content.replace(oldLoadBlockRegex, newLoadBlock);

// 2. Tweak the iframe transition to be hyper-fast (0.05s)
content = content.replace(/transition: all 0\\.12s cubic-bezier\\(0\\.25, 1, 0\\.5, 1\\);/g, 'transition: all 0.08s ease-out;');

// 3. Remove spinner entirely from HTML if possible (or just leave it hidden)
// It's hidden by default anyway.

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.43'");

fs.writeFileSync(file, content);
console.log('Ultra fast navigation applied!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/ultra_fast.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/ultra_fast.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v31\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
ultraFast().catch(console.error);
