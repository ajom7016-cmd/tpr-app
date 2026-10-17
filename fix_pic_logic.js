const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPicLogic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // We need to move tryLoadPic logic into generateTasks
    // Find the end of generateTasks()
    const genEnd = `    document.getElementById('tasks-container').innerHTML = html;
    
    let progressPercent = limit > 0 ? (window.completedTasks / limit) * 100 : 0;
}`;

    const newGenEnd = `    document.getElementById('tasks-container').innerHTML = html;
    
    // Apply profile picture directly after rendering
    try {
        let pic = null;
        try { pic = window.parent.localStorage.getItem('userProfilePic'); } catch(e){}
        if(!pic) { try { pic = localStorage.getItem('userProfilePic'); } catch(e){} }
        if(!pic) {
            try { 
                let hdr = window.parent.document.getElementById('header-profile-img');
                if(hdr && hdr.src && hdr.src.includes('data:image')) { pic = hdr.src; }
            } catch(e){}
        }
        if (pic && pic.includes('data:image')) {
            const picEl = document.getElementById('vip-user-pic');
            const defEl = document.getElementById('vip-user-default');
            if (picEl && defEl) {
                picEl.src = pic;
                picEl.classList.remove('hidden');
                defEl.classList.add('hidden');
            }
        }
    } catch(e) {}
}`;
    
    if (code.includes(genEnd)) {
        code = code.replace(genEnd, newGenEnd);
    }
    
    // Clean up the old tryLoadPic calls just in case
    // (It's okay if they stay as dead code, but better to bump the cache)
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v17');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.15';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Profile picture loading logic injected directly into generateTasks!");
    ssh.dispose();
}
fixPicLogic().catch(console.error);
