const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function finalSlimAndPic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // 1. Reduce padding/margins
    code = code.replace('p-4 mb-3 mt-1', 'p-3 mb-2 mt-1');
    code = code.replace('rounded-[24px]', 'rounded-[20px]');
    // Top Row margin
    code = code.replace('<div class="flex justify-between items-start mb-3">', '<div class="flex justify-between items-start mb-1.5">');
    // Middle text margin
    code = code.replace('<div class="mb-2">', '<div class="mb-1">');
    // Progress bar margin
    code = code.replace('<div class="mt-3 bg-white/20 rounded-xl p-3 border border-white/30', '<div class="mt-2 bg-white/20 rounded-xl p-2.5 border border-white/30');
    // Bottom row margin
    code = code.replace('<div class="flex items-center gap-4 mt-3 pl-1">', '<div class="flex items-center gap-4 mt-2 pl-1">');
    
    // 2. Fix Profile Picture Logic
    // We will replace the entire "Add Profile Pic Logic" section
    const oldPicLogicStart = "// Add Profile Pic Logic";
    const oldPicLogicEnd = "// Listen for profile pic updates";
    
    const newPicLogic = `// Add Profile Pic Logic
        let profilePic = null;
        try { profilePic = window.parent.localStorage.getItem('userProfilePic'); } catch(e) { }
        if (!profilePic) {
            try { profilePic = localStorage.getItem('userProfilePic'); } catch(e) {}
        }
        // Fallback: Read directly from header image
        if (!profilePic) {
            try { 
                let headerImg = window.parent.document.getElementById('header-profile-img');
                if(headerImg && headerImg.src && headerImg.src.length > 50) {
                    profilePic = headerImg.src;
                }
            } catch(e) {}
        }
        
        if (profilePic) {
            const picEl = document.getElementById('vip-user-pic');
            if (picEl) {
                picEl.src = profilePic;
                picEl.style.display = 'block';
            }
        }
        
        `;
    
    if(code.includes(oldPicLogicStart) && code.includes(oldPicLogicEnd)) {
        const pre = code.substring(0, code.indexOf(oldPicLogicStart));
        const post = code.substring(code.indexOf(oldPicLogicEnd));
        code = pre + newPicLogic + post;
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Ultimate slim and pic fix applied!");
    } else {
        console.log("Markers not found!");
    }
    
    ssh.dispose();
}
finalSlimAndPic().catch(console.error);
