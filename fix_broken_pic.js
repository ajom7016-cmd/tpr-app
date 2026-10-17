const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixBrokenPic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Replace the HTML for the user pic container
    const oldHtml = '<img id="vip-user-pic" src="" style="display:none;" class="w-6 h-6 rounded-full object-cover" />';
    // Sometimes display:none is missing or different, let's find the exact string
    // Let's use regex to replace the img tag
    const newHtml = `
    <div id="vip-user-pic-container" class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
        <svg id="vip-user-default" class="w-5 h-5 text-slate-400 mt-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <img id="vip-user-pic" src="" class="w-full h-full object-cover hidden" />
    </div>
    `;
    
    // Replace the img tag
    code = code.replace(/<img id="vip-user-pic"[^>]*>/, newHtml);
    
    // Now fix the JS logic
    const oldJsStart = "function tryLoadPic() {";
    const oldJsEnd = "if(!tryLoadPic()) {";
    
    const newJs = `
        function tryLoadPic() {
            try {
                let pic = null;
                try { pic = window.parent.localStorage.getItem('userProfilePic'); } catch(e){}
                if(!pic) { try { pic = localStorage.getItem('userProfilePic'); } catch(e){} }
                if(!pic) {
                    try { 
                        let hdr = window.parent.document.getElementById('header-profile-img');
                        // A valid base64 image or a true URL (not the app.html url which is empty src default)
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
                        return true;
                    }
                }
            } catch(e) {}
            return false;
        }
        
        `;
        
    if(code.includes(oldJsStart)) {
        const pre = code.substring(0, code.indexOf(oldJsStart));
        const post = code.substring(code.indexOf(oldJsEnd));
        code = pre + newJs + post;
    }
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("Fixed broken pic and added default avatar!");
    
    ssh.dispose();
}
fixBrokenPic().catch(console.error);
