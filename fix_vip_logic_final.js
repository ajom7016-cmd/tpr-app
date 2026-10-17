const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixVipLogicAgain() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const vipFile = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let vip = fs.readFileSync(vipFile, 'utf8');

// 1. Remove the old faulty script
vip = vip.replace(/<script>[\\s\\S]*?\\/\\/ Fetch user profile and update buttons correctly[\\s\\S]*?<\\/script>/, '');

// 2. Add the correct script at the bottom
const dynamicBtnScript = \`
<script>
    // Fetch user profile and update buttons correctly
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            let token = localStorage.getItem('userToken');
            if (!token && window.parent) {
                try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
            }
            if(token) {
                const res = await fetch('/api/profile', { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                
                // data IS the user object (it has id, vip_plan, etc.)
                if(data && data.id) {
                    let currentLevel = 0;
                    if(data.vip_plan && data.vip_plan !== 'Free') {
                        currentLevel = parseInt(data.vip_plan.replace('VIP ', '')) || 0;
                    }
                    
                    // If user is on a paid VIP, change the Free button from 'Current Plan' to 'Expired'
                    if (currentLevel > 0) {
                        const freeBtn = document.querySelector('button[onclick*="Free Plan"]');
                        if (freeBtn) {
                            freeBtn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Expired</span>';
                            freeBtn.removeAttribute('onclick');
                            freeBtn.classList.add('opacity-50', 'pointer-events-none');
                        }
                    }
                    
                    // Update the active VIP button
                    const buttons = document.querySelectorAll('.btn-subscribe');
                    buttons.forEach(btn => {
                        const onclick = btn.getAttribute('onclick');
                        if (onclick && onclick.includes('subscribeVIP(' + currentLevel + ',')) {
                            // Found the current plan
                            btn.classList.add('opacity-50', 'pointer-events-none');
                            btn.innerHTML = '<span class="text-[15px] font-black flex-1 text-center tracking-wide text-white">Current Plan</span>';
                            btn.removeAttribute('onclick');
                            btn.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
                        }
                    });
                }
            }
        } catch(e) { console.error(e); }
    });
</script>
\`;

vip = vip.replace('</body>', dynamicBtnScript + '\\n</body>');
fs.writeFileSync(vipFile, vip);

// Cache Busting
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '16.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

console.log('Fixed VIP Current Plan Logic Again!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_vip_logic2.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_vip_logic2.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v150\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
fixVipLogicAgain().catch(console.error);
