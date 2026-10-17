const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixShapeAndPic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // 1. Fix Shape
    code = code.replace('rounded-[20px]', 'rounded-[32px]');
    
    // 2. Fix Profile Pic Logic completely
    const oldPicLogicStart = "// Add Profile Pic Logic";
    const oldPicLogicEnd = "// Listen for profile pic updates";
    
    const newPicLogic = `// Add Profile Pic Logic
        function tryLoadPic() {
            try {
                let pic = null;
                try { pic = window.parent.localStorage.getItem('userProfilePic'); } catch(e){}
                if(!pic) { try { pic = localStorage.getItem('userProfilePic'); } catch(e){} }
                if(!pic) {
                    try { 
                        let hdr = window.parent.document.getElementById('header-profile-img');
                        if(hdr && hdr.src && hdr.src.includes('base64')) { pic = hdr.src; }
                        else if(hdr && hdr.src && hdr.src.length > 20 && !hdr.src.includes('default')) { pic = hdr.src; }
                    } catch(e){}
                }
                
                if (pic && pic.length > 10) {
                    const picEl = document.getElementById('vip-user-pic');
                    if (picEl) {
                        picEl.src = pic;
                        picEl.style.display = 'block';
                        return true;
                    }
                }
            } catch(e) {}
            return false;
        }
        
        if(!tryLoadPic()) {
            let attempts = 0;
            let intv = setInterval(() => {
                if(tryLoadPic() || ++attempts > 20) clearInterval(intv);
            }, 500);
        }
        
        `;
    
    if(code.includes(oldPicLogicStart) && code.includes(oldPicLogicEnd)) {
        const pre = code.substring(0, code.indexOf(oldPicLogicStart));
        const post = code.substring(code.indexOf(oldPicLogicEnd));
        code = pre + newPicLogic + post;
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Shape and pic retry logic applied!");
    } else {
        console.log("Markers not found!");
    }
    
    ssh.dispose();
}
fixShapeAndPic().catch(console.error);
