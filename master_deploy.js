const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function masterDeploy() {
    console.log("Preparing fresh files...");
    
    // 1. Profile Page
    let profileContent = fs.readFileSync('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\public\\\\user_profile_premium_glass\\\\code.html', 'utf8');
    // REMOVE opacity: 0 from smoothLoad to prevent the invisibility bug that caused the scanlines
    profileContent = profileContent.replace(/opacity:\s*0;/g, '');
    fs.writeFileSync('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\temp_profile.html', profileContent);
    
    // 2. VIP Plan Page
    let vipContent = fs.readFileSync('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\public\\\\investment_premium_glass\\\\vip.html', 'utf8');
    // Fix overlapping cards
    vipContent = vipContent.replace(/h-\[225px\]/g, 'h-auto min-h-[240px] pb-10');
    // Remove heavy bg-3d
    vipContent = vipContent.replace(/<div class="bg-3d">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
    // Remove opacity: 0
    vipContent = vipContent.replace(/opacity:\s*0;/g, '');
    // Append the dynamic Javascript that we actually need (since the old script tag was broken)
    const vipScript = `
    <script>
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
        } catch(e) {}
    });
    </script>
    </body>
    `;
    vipContent = vipContent.replace('</body>', vipScript);
    fs.writeFileSync('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\temp_vip.html', vipContent);
    
    // Connect to SSH
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Upload files directly (no base64 limits!)
    console.log("Uploading fresh files...");
    await ssh.putFile('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\temp_profile.html', '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    await ssh.putFile('C:\\\\Users\\\\ajom7\\\\Downloads\\\\TPR\\\\JMJ_App\\\\temp_vip.html', '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    // Cache bust app.html and sw.js
    console.log("Busting cache...");
    const v = "v_fresh_" + Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = '${v}';/g" /var/www/jmj_app/public/app.html`);
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${v}';/g" /var/www/jmj_app/public/sw.js`);
    
    console.log("All done! pristine deployment complete.");
    ssh.dispose();
}
masterDeploy().catch(console.error);
