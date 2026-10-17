const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // We will do a generic regex replace for document.getElementById('tasks-container').innerHTML = html;
    // to include the picture logic right after it.
    
    const targetRegex = /document\.getElementById\('tasks-container'\)\.innerHTML\s*=\s*html;/g;
    
    const newLogic = `document.getElementById('tasks-container').innerHTML = html;
    
    // Apply picture directly after drawing the HTML
    try {
        let pic = null;
        try { pic = window.parent.localStorage.getItem('userProfilePic'); } catch(e){}
        if(!pic) { try { pic = localStorage.getItem('userProfilePic'); } catch(e){} }
        if(!pic) {
            try { 
                let hdr = window.parent.document.getElementById('header-profile-img');
                if(hdr && hdr.src && hdr.src.length > 20 && !hdr.src.includes('.html')) { pic = hdr.src; }
            } catch(e){}
        }
        
        if (pic && pic.length > 10) {
            const picEl = document.getElementById('vip-user-pic');
            const defEl = document.getElementById('vip-user-default');
            if (picEl && defEl) {
                picEl.src = pic;
                picEl.classList.remove('hidden');
                defEl.classList.add('hidden');
            }
        }
    } catch(e) {}
    `;
    
    code = code.replace(targetRegex, newLogic);
    
    // Bump cache
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v20');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.18';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    // Validate that it worked
    let verify = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -B 2 -A 5 "// Apply picture directly after drawing the HTML"');
    console.log("Verification:\n", verify.stdout);
    
    ssh.dispose();
}
forceFix().catch(console.error);
