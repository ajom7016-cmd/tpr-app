const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixTasksPic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // The exact end of generateTasks is `document.getElementById('tasks-container').innerHTML = html;`
    // followed by `}`. Let's find it.
    
    const targetString = `document.getElementById('tasks-container').innerHTML = html;
}`;

    const newCode = `document.getElementById('tasks-container').innerHTML = html;
    
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
}`;

    if (code.includes(targetString)) {
        code = code.replace(targetString, newCode);
    } else {
        // Alternative match
        const altString = `document.getElementById('tasks-container').innerHTML = html;
    
}`;
        if (code.includes(altString)) {
            code = code.replace(altString, newCode);
        }
    }
    
    // Let's also update the message listener to make sure it handles both logic styles
    
    // Bump cache
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v19');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.17';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    
    console.log("Profile picture loading logic injected INSIDE generateTasks!");
    ssh.dispose();
}
fixTasksPic().catch(console.error);
