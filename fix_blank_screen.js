const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixBlankScreen() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const file = '/var/www/jmj_app/public/app.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject loader HTML before iframe
if (!content.includes('id="frame-loader"')) {
    const loaderHtml = \`
    <div id="frame-loader" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; display: none; flex-direction: column; align-items: center; justify-content: center;">
        <div class="w-8 h-8 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin"></div>
    </div>
    <iframe id="app-frame"\`;
    content = content.replace('<iframe id="app-frame"', loaderHtml);
}

// 2. Modify loadPage to show loader
content = content.replace("frame.style.opacity = '0';", "frame.style.opacity = '0';\\n            const loader = document.getElementById('frame-loader');\\n            if(loader) loader.style.display = 'flex';");

// 3. Modify onload listener to hide loader
content = content.replace("this.style.transform = 'translateY(0px)';", "this.style.transform = 'translateY(0px)';\\n                const loader = document.getElementById('frame-loader');\\n                if(loader) setTimeout(() => { loader.style.display = 'none'; }, 150);");

// Bump version
content = content.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.41'");

fs.writeFileSync(file, content);
console.log('Fixed blank screen issue successfully!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_blank.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_blank.js');
    console.log(res.stdout);
    if(res.stderr) console.error(res.stderr);
    
    // Bump sw
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v29\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixBlankScreen().catch(console.error);
