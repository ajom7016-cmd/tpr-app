const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function makeExactMatch() {
    console.log("Preparing Home-identical background for Plan & Profile...");

    // ==========================================
    // 1. VIP PLAN PAGE (vip_final.html)
    // ==========================================
    let vipHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\investment_premium_glass\\vip.html', 'utf8');

    // Make body transparent like Home page
    vipHtml = vipHtml.replace(/body\s*\{[^}]*background-color:[^;]*;/i, 'body { background-color: transparent !important;');
    vipHtml = vipHtml.replace(/<body[^>]*>/i, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');
    
    // In .bg-3d, make background transparent instead of #f8fafc
    vipHtml = vipHtml.replace(/\.bg-3d\s*\{[^}]*background:[^;]*;/i, '.bg-3d { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background: transparent !important;');
    
    // Add aura-bg class matching Home page
    const auraStyle = `
        .aura-bg {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            background: radial-gradient(ellipse at center, rgba(255, 69, 58, 0.25) 0%, rgba(255, 149, 0, 0.15) 45%, rgba(246, 248, 251, 0) 70%);
            filter: blur(40px);
            z-index: -1;
            pointer-events: none;
        }
    `;
    vipHtml = vipHtml.replace('</style>', auraStyle + '\n</style>');

    // Inject aura behind top area
    vipHtml = vipHtml.replace('<div class="px-6 pb-2">', '<div class="aura-bg top-[40px] h-[340px]"></div>\n    <div class="px-6 pb-2">');

    // Fix card height and spacing so cards never overlap
    // Original had h-[225px] and mb-12. If content is taller, min-h-[240px] and mb-14 gives 30px clear space!
    vipHtml = vipHtml.replace(/h-\[225px\]/g, 'min-h-[245px] pb-8 mb-14');
    vipHtml = vipHtml.replace(/space-y-12/g, 'space-y-14');

    // Remove any opacity 0
    vipHtml = vipHtml.replace(/opacity:\s*0;/g, '');

    // Add VIP subscription button handler script
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
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\vip_exact.html', vipHtml, 'utf8');

    // ==========================================
    // 2. PROFILE PAGE (code_final.html)
    // ==========================================
    let profHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\user_profile_premium_glass\\code.html', 'utf8');
    
    // Make body transparent like Home page
    profHtml = profHtml.replace(/body\s*\{[^}]*background-color:[^;]*;/i, 'body { background-color: transparent !important;');
    profHtml = profHtml.replace(/<body[^>]*>/i, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');
    
    // Make .bg-3d transparent instead of radial-gradient(#ffe4e6, #f8fafc, #ffedd5)
    profHtml = profHtml.replace(/\.bg-3d\s*\{[^}]*background:[^;]*;/i, '.bg-3d { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background: transparent !important;');

    // Add aura-bg
    profHtml = profHtml.replace('</style>', auraStyle + '\n</style>');
    profHtml = profHtml.replace('<div class="max-w-[400px]', '<div class="aura-bg top-[60px] h-[340px]"></div>\n    <div class="max-w-[400px]');
    
    // Remove opacity 0
    profHtml = profHtml.replace(/opacity:\s*0;/g, '');
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\profile_exact.html', profHtml, 'utf8');

    // ==========================================
    // 3. UPLOAD TO SERVER VIA SSH
    // ==========================================
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Uploading VIP exact...");
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\vip_exact.html', '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    
    console.log("Uploading Profile exact...");
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\profile_exact.html', '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');

    console.log("Checking app.html...");
    let appRes = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let aHtml = appRes.stdout;
    
    // Ensure iframe is transparent so parent background shines through
    aHtml = aHtml.replace(
        /id="app-frame"[^>]*style="[^"]*"/,
        'id="app-frame" allow="microphone; camera" style="opacity: 1 !important; transform: none !important; width: 100%; height: 100%; border: none; flex: 1; margin-bottom: 75px; background: transparent !important;"'
    );
    // Remove querySelector hiding bg-3d
    aHtml = aHtml.replace(/const b=d\.querySelector\('\.bg-3d'\);[\s\S]*?b\.style\.display='none';/g, '');
    
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/app.html\n${aHtml}\nEOF`);

    console.log("ALL DONE! Home background now flows seamlessly through Plan & Profile!");
    ssh.dispose();
}

makeExactMatch().catch(console.error);
