const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixProfileAndVip() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Update server.js to include created_at
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let serverCode = res.stdout;
    
    const oldQuery = `SELECT id, name, phone, email, balance, role, vip_plan, total_referrals, total_tasks, 
(withdraw_pin IS NOT NULL) as has_pin, password_changed_at, pin_changed_at, profile_changed_at FROM users WHERE id = ?`;
    
    const newQuery = `SELECT id, name, phone, email, balance, role, vip_plan, total_referrals, total_tasks, created_at,
(withdraw_pin IS NOT NULL) as has_pin, password_changed_at, pin_changed_at, profile_changed_at FROM users WHERE id = ?`;
    
    if (serverCode.includes(oldQuery)) {
        serverCode = serverCode.replace(oldQuery, newQuery);
        let b64Server = Buffer.from(serverCode).toString('base64');
        await ssh.execCommand(`echo "${b64Server}" | base64 -d > /var/www/jmj_app/server.js`);
        await ssh.execCommand('pm2 restart server'); // Restart to apply API change
    }

    // 2. Inject dynamic logic into vip.html
    let resVip = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let vipCode = resVip.stdout;
    
    // Give the Free Plan button an ID so we can target it
    const oldFreeBtn = `<button onclick="alert('You are already on the Free Plan! Upgrade to a VIP plan to earn more.')" class="w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                <span class="text-[15px] font-black tracking-wide">Current Plan</span>
            </button>`;
            
    const newFreeBtn = `<button id="free-plan-btn" onclick="alert('You are on the Free Plan.')" class="w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md" style="background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);">
                <span id="free-plan-text" class="text-[15px] font-black tracking-wide">Current Plan</span>
            </button>`;
            
    if (vipCode.includes(oldFreeBtn)) {
        vipCode = vipCode.replace(oldFreeBtn, newFreeBtn);
    }
    
    // Inject the script before </body>
    const dynamicScript = `
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    const res = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    
                    if (res.ok) {
                        const user = await res.json();
                        if (user) {
                            const freeBtn = document.getElementById('free-plan-btn');
                            const freeText = document.getElementById('free-plan-text');
                            
                            if (freeBtn && freeText) {
                                if (user.vip_plan === 'Free') {
                                    // Check expiry
                                    const createdAt = new Date(user.created_at + 'Z');
                                    const now = new Date();
                                    const diffDays = Math.ceil(Math.abs(now - createdAt) / (1000 * 60 * 60 * 24));
                                    
                                    if (diffDays > 2) {
                                        freeBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                                        freeBtn.onclick = () => alert('আপনার ফ্রি প্ল্যানের মেয়াদ শেষ হয়ে গেছে। দয়া করে VIP কিনুন!');
                                        freeText.innerHTML = '<span class="material-symbols-outlined mr-1" style="font-size:18px;">lock</span> EXPIRED';
                                    }
                                } else {
                                    // User is on another VIP plan
                                    freeBtn.style.background = 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
                                    freeBtn.onclick = () => alert('You are already a VIP member!');
                                    freeText.innerHTML = '<span class="material-symbols-outlined mr-1" style="font-size:18px;">lock</span> Basic Plan';
                                }
                            }
                        }
                    }
                }
            } catch (e) { console.error(e); }
        });
    </script>
    </body>`;
    
    vipCode = vipCode.replace('</body>', dynamicScript);
    
    // Bump cache
    let resSW = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    let swCode = resSW.stdout;
    swCode = swCode.replace(/tpr-super-cache-v[0-9]+/g, 'tpr-super-cache-v21');
    await ssh.execCommand(`echo "${Buffer.from(swCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    
    let resApp = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let appCode = resApp.stdout;
    appCode = appCode.replace(/const timestamp = '1\.0\.[0-9]+';/g, "const timestamp = '1.0.19';");
    await ssh.execCommand(`echo "${Buffer.from(appCode).toString('base64')}" | base64 -d > /var/www/jmj_app/public/app.html`);
    
    let b64Vip = Buffer.from(vipCode).toString('base64');
    await ssh.execCommand(`echo "${b64Vip}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
    
    console.log("VIP Expiry Lock implemented!");
    ssh.dispose();
}
fixProfileAndVip().catch(console.error);
