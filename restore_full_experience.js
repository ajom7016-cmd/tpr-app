const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function restoreFullExperience() {
    console.log("Preparing restored files...");
    
    // ==========================================
    // 1. VIP PLAN PAGE (investment_premium_glass/vip_final.html)
    // ==========================================
    let vipHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\investment_premium_glass\\vip.html', 'utf8');
    
    // Remove the stuck opacity: 0
    vipHtml = vipHtml.replace(/opacity:\s*0;/g, '');
    
    // Fix card height and spacing so buttons NEVER overlap
    // Replace h-[225px] with min-h-[250px] pb-8 and mb-14
    vipHtml = vipHtml.replace(/h-\[225px\]/g, 'min-h-[250px] pb-8 mb-14');
    vipHtml = vipHtml.replace(/space-y-12/g, 'space-y-14');
    
    // Append the clean VIP status script at the end
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
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_vip.html', vipHtml, 'utf8');

    // ==========================================
    // 2. PROFILE PAGE (user_profile_premium_glass/code_final.html)
    // ==========================================
    let profHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\user_profile_premium_glass\\code.html', 'utf8');
    profHtml = profHtml.replace(/opacity:\s*0;/g, '');
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_profile.html', profHtml, 'utf8');

    // ==========================================
    // 3. HOME & TASKS PAGES (Ensure transparent body so background shows)
    // ==========================================
    let homeHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\glassmorphic_1\\code.html', 'utf8');
    homeHtml = homeHtml.replace(/opacity:\s*0;/g, '');
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_home.html', homeHtml, 'utf8');

    let tasksHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\glassmorphic_2\\code.html', 'utf8');
    tasksHtml = tasksHtml.replace(/opacity:\s*0;/g, '');
    fs.writeFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_tasks.html', tasksHtml, 'utf8');

    // ==========================================
    // 4. SSH UPLOAD & APP.HTML FIX
    // ==========================================
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    console.log("Uploading VIP & Profile & Home & Tasks...");
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_vip.html', '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_profile.html', '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_home.html', '/var/www/jmj_app/public/glassmorphic_1/code.html');
    await ssh.putFile('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\restored_tasks.html', '/var/www/jmj_app/public/glassmorphic_2/code.html');

    console.log("Fixing app.html to bring back backgrounds and transparent iframe...");
    let appRes = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let aHtml = appRes.stdout;
    
    // Remove the querySelector that was hiding bg-3d
    aHtml = aHtml.replace(/const b=d\.querySelector\('\.bg-3d'\);[\s\S]*?b\.style\.display='none';/g, '');
    
    // Ensure iframe is transparent so parent background shines through
    aHtml = aHtml.replace(
        /id="app-frame"[^>]*style="[^"]*"/,
        'id="app-frame" allow="microphone; camera" style="opacity: 1 !important; transform: none !important; width: 100%; height: 100%; border: none; flex: 1; margin-bottom: 75px; background: transparent !important;"'
    );
    
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/app.html\n${aHtml}\nEOF`);

    console.log("Deployment and background restoration complete!");
    ssh.dispose();
}

restoreFullExperience().catch(console.error);
