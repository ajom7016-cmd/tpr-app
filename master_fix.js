const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function masterFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. VIP Page - Get from local pristine zip
    let vipContent = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', 'utf8');
    
    // Completely remove bg-3d HTML block
    const bg3dRegex = /<!-- Premium Animated Background Light -->[\s\S]*?<div class="bg-3d">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    vipContent = vipContent.replace(bg3dRegex, '');
    
    // Also remove the CSS for bg-3d to be absolutely sure
    vipContent = vipContent.replace(/\.bg-3d\s*\{[^}]+\}/g, '');
    vipContent = vipContent.replace(/\.orb-1\s*\{[^}]+\}/g, '');
    vipContent = vipContent.replace(/\.orb-2\s*\{[^}]+\}/g, '');
    
    // Fix overlapping cards! The cards have h-[225px] which is too small for the content on some phones.
    // Replace h-[225px] with h-auto min-h-[235px] and add pb-10 so the absolute button at the bottom doesn't hit the next card!
    vipContent = vipContent.replace(/h-\[225px\]/g, 'h-auto min-h-[235px] pb-10');
    
    // Inject the dynamic script from the user's debug_vip.html
    const vipScript = `
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            let token = localStorage.getItem('userToken');
            if (!token && window.parent) {
                try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
            }
            if(token) {
                const res = await fetch('/api/profile', { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                
                if(data && data.id) {
                    let currentLevel = 0;
                    if(data.vip_plan && data.vip_plan !== 'Free' && data.vip_plan !== 'VIP 0') {
                        currentLevel = parseInt(data.vip_plan.replace('VIP ', '')) || 0;
                    }
                    
                    if (currentLevel > 0) {
                        const freeBtn = document.querySelector('button[onclick*="Free Plan"]');
                        if (freeBtn) {
                            freeBtn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Expired</span>';
                            freeBtn.removeAttribute('onclick');
                            freeBtn.classList.add('opacity-50', 'pointer-events-none');
                        }
                    }
                    
                    const buttons = document.querySelectorAll('.btn-subscribe');
                    buttons.forEach(btn => {
                        const oc = btn.getAttribute('onclick');
                        if(oc) {
                            const match = oc.match(/subscribeVIP\\((\\d+)/);
                            if(match) {
                                const btnLevel = parseInt(match[1]);
                                if (btnLevel === currentLevel) {
                                    btn.innerHTML = '<span class="text-[15px] font-black flex-1 text-center mr-2 tracking-wide text-white">Current Plan</span>';
                                    btn.className = "w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-lg bg-green-500";
                                    btn.removeAttribute('onclick');
                                } else if (btnLevel < currentLevel) {
                                    btn.innerHTML = '<span class="text-[15px] font-black flex-1 text-center mr-2 tracking-wide text-white">Expired</span>';
                                    btn.className = "w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md bg-slate-400 opacity-50";
                                    btn.removeAttribute('onclick');
                                }
                            }
                        }
                    });
                }
            }
        } catch(e) { console.log(e); }
    });
`;
    vipContent = vipContent.replace('</script>', vipScript + '\n    </script>');
    
    // Upload VIP V3
    let b64Vip = Buffer.from(vipContent).toString('base64');
    await ssh.execCommand(`echo "${b64Vip}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip_v3.html`);
    
    // 2. Profile Page - Get the 21KB backup
    let profileContent = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/debug_profile.html', 'utf8');
    
    // Remove bg-3d references in Profile CSS just in case
    profileContent = profileContent.replace(/\.bg-3d\s*\{[^}]+\}/g, '');
    
    // Upload Profile V3
    let b64Profile = Buffer.from(profileContent).toString('base64');
    await ssh.execCommand(`echo "${b64Profile}" | base64 -d > /var/www/jmj_app/public/user_profile_premium_glass/code_v3.html`);
    
    // 3. Update app.html
    let rApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appContent = rApp.stdout;
    
    appContent = appContent.replace(/'investment_premium_glass\/vip(_final)?\.html'/g, "'investment_premium_glass/vip_v3.html'");
    appContent = appContent.replace(/'user_profile_premium_glass\/code(_final)?\.html'/g, "'user_profile_premium_glass/code_v3.html'");
    appContent = appContent.replace(/const currentVersion = [\\'\\"][^\\'\\"]+[\\'\\"];/, "const currentVersion = '" + Date.now() + "';");
    
    let b64App = Buffer.from(appContent).toString('base64');
    await ssh.execCommand(`echo "${b64App}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    // 4. Update sw.js
    let rSw = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swContent = rSw.stdout;
    
    swContent = swContent.replace(/\/investment_premium_glass\/vip(_final)?\.html/g, '/investment_premium_glass/vip_v3.html');
    swContent = swContent.replace(/\/user_profile_premium_glass\/code(_final)?\.html/g, '/user_profile_premium_glass/code_v3.html');
    swContent = swContent.replace(/const CACHE_NAME = [\\'\\"]tpr-super-cache-[^\\'\\"]+[\\'\\"];/, "const CACHE_NAME = 'tpr-super-cache-" + Date.now() + "';");
    
    let b64Sw = Buffer.from(swContent).toString('base64');
    await ssh.execCommand(`echo "${b64Sw}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    console.log("Master fix applied!");
    ssh.dispose();
}
masterFix().catch(console.error);
