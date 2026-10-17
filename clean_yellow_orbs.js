const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function makeIdenticalToHome() {
    console.log("Making Plan and Profile backgrounds 100% IDENTICAL to Home...");

    // ==============================================================
    // 1. VIP PLAN PAGE (vip_final.html)
    // ==============================================================
    let vipHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\investment_premium_glass\\vip.html', 'utf8');

    // Remove all bg-3d CSS, orbs CSS, float animation, and bg-blocks
    vipHtml = vipHtml.replace(/\/\* Ultra Premium Animated 3D Background - Light Mode \*\/[\s\S]*?@keyframes float[\s\S]*?\}\s*\}/, '');
    vipHtml = vipHtml.replace(/\.bg-block-1\s*\{[\s\S]*?\}\s*\.bg-block-2\s*\{[\s\S]*?\}/, '');
    vipHtml = vipHtml.replace(/\.bg-3d\s*\{[\s\S]*?\}/g, '');
    vipHtml = vipHtml.replace(/\.orb-1\s*\{[\s\S]*?\}/g, '');
    vipHtml = vipHtml.replace(/\.orb-2\s*\{[\s\S]*?\}/g, '');

    // Remove the HTML <div class="bg-3d"> ... </div>
    vipHtml = vipHtml.replace(/<div class="bg-3d">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, '');
    vipHtml = vipHtml.replace(/<div class="bg-3d">[\s\S]*?<\/div>/, '');

    // Remove any opacity: 0
    vipHtml = vipHtml.replace(/opacity:\s*0;/g, '');

    // Make body pure transparent just like Home
    vipHtml = vipHtml.replace(/body\s*\{[^}]*background-color:[^;]*;/i, 'body { background-color: transparent !important;');
    vipHtml = vipHtml.replace(/<body[^>]*>/i, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');

    // Fix card height and spacing so cards never overlap
    vipHtml = vipHtml.replace(/h-\[225px\]/g, 'min-h-[245px] pb-8 mb-14');
    vipHtml = vipHtml.replace(/space-y-12/g, 'space-y-14');

    // Add clean dynamic VIP buttons script
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
                                    btn.innerHTML = '<span class="text-[15px] font-black tracking-wide text-white">Current Plan</span>';
                                    btn.className = "w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-lg bg-green-500";
                                    btn.removeAttribute('onclick');
                                } else if (btnLevel < currentLevel) {
                                    btn.innerHTML = '<span class="text-[15px] font-black tracking-wide text-white">Expired</span>';
                                    btn.className = "w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md bg-slate-400 opacity-60";
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
    </body>`;
    vipHtml = vipHtml.replace('</body>', vipScript);
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\vip_clean.html', vipHtml, 'utf8');

    // ==============================================================
    // 2. PROFILE PAGE (code_final.html)
    // ==============================================================
    let profHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\user_profile_premium_glass\\code.html', 'utf8');

    // Remove all bg-3d CSS, orbs CSS
    profHtml = profHtml.replace(/\/\* Animated Aura Background[\s\S]*?\.orb-3\s*\{[\s\S]*?filter:\s*blur\(40px\);\s*\}/, '');
    profHtml = profHtml.replace(/\.bg-3d\s*\{[\s\S]*?\}/g, '');
    profHtml = profHtml.replace(/\.orb-1\s*\{[\s\S]*?\}/g, '');
    profHtml = profHtml.replace(/\.orb-2\s*\{[\s\S]*?\}/g, '');
    profHtml = profHtml.replace(/\.orb-3\s*\{[\s\S]*?\}/g, '');

    // Remove the HTML <div class="bg-3d"> ... </div>
    profHtml = profHtml.replace(/<div class="bg-3d">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');
    profHtml = profHtml.replace(/<div class="bg-3d">[\s\S]*?<\/div>/, '');

    // Remove opacity: 0
    profHtml = profHtml.replace(/opacity:\s*0;/g, '');

    // Make body pure transparent just like Home
    profHtml = profHtml.replace(/body\s*\{[^}]*background-color:[^;]*;/i, 'body { background-color: transparent !important;');
    profHtml = profHtml.replace(/<body[^>]*>/i, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');

    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\profile_clean.html', profHtml, 'utf8');

    // ==============================================================
    // 3. UPLOAD TO LIVE SERVER
    // ==============================================================
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Uploading clean VIP...");
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\vip_clean.html', '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');

    console.log("Uploading clean Profile...");
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\profile_clean.html', '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');

    console.log("Finished! Yellow/orange orbs removed, clean Home background is live!");
    ssh.dispose();
}

makeIdenticalToHome().catch(console.error);
