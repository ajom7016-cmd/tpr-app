const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function applyLogic() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');

// 1. Update server.js
const serverFile = '/var/www/jmj_app/server.js';
let server = fs.readFileSync(serverFile, 'utf8');

// Ensure roiMap[0] is 50
server = server.replace(/const roiMap = \\{ 0: 10/g, 'const roiMap = { 0: 50');

// Inject the 2-day lock for level 0 inside /api/tasks/complete
const taskBlockRegex = /let level = 0;[\\s\\S]*?const roiMap =/m;
if (server.match(taskBlockRegex)) {
    const lockLogic = \`let level = 0;
            if (user.vip_plan && user.vip_plan !== 'Free') {
                level = parseInt(user.vip_plan.replace('VIP ', '')) || 0;
            }
            
            // 2-Day Lock for Free Plan
            if (level === 0 && user.created_at) {
                const joinDate = new Date(user.created_at).getTime();
                const now = new Date().getTime();
                // 48 hours = 2 * 24 * 60 * 60 * 1000 = 172800000 ms
                if (now - joinDate > 172800000) {
                    return res.status(400).json({ error: 'Free plan expired after 2 days. Please upgrade to a premium VIP plan to continue working!' });
                }
            }

            const roiMap =\`;
    server = server.replace(/let level = 0;[\\s\\S]*?const roiMap =/m, lockLogic);
    fs.writeFileSync(serverFile, server);
    console.log('server.js updated with 2-day lock and 50 Tk logic.');
    require('child_process').execSync('pm2 restart all');
}

// 2. Update vip.html to show "Current Plan"
const vipFile = '/var/www/jmj_app/public/investment_premium_glass/vip.html';
let vip = fs.readFileSync(vipFile, 'utf8');

const dynamicBtnScript = \`
<script>
    // Fetch user plan and update buttons
    window.addEventListener('DOMContentLoaded', async () => {
        try {
            let token = localStorage.getItem('userToken');
            if (!token && window.parent) {
                try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
            }
            if(token) {
                const res = await fetch('/api/user', { headers: { 'Authorization': 'Bearer ' + token } });
                const data = await res.json();
                if(data.user) {
                    let currentLevel = 0;
                    if(data.user.vip_plan && data.user.vip_plan !== 'Free') {
                        currentLevel = parseInt(data.user.vip_plan.replace('VIP ', '')) || 0;
                    }
                    
                    const buttons = document.querySelectorAll('.btn-subscribe');
                    // We assume buttons are in order VIP 1 to VIP 6, but let's check onclick attribute
                    buttons.forEach(btn => {
                        const onclick = btn.getAttribute('onclick');
                        if (onclick && onclick.includes('subscribeVIP(' + currentLevel + ',')) {
                            btn.classList.add('opacity-50', 'pointer-events-none');
                            btn.innerHTML = '<span class="text-[15px] font-black flex-1 text-center tracking-wide text-white">Current Plan</span>';
                            btn.removeAttribute('onclick');
                        }
                    });
                }
            }
        } catch(e) { console.error(e); }
    });
</script>
</body>\`;

vip = vip.replace('</body>', dynamicBtnScript);
fs.writeFileSync(vipFile, vip);
console.log('vip.html updated with dynamic Current Plan buttons.');

// Cache Busting
const appFile = '/var/www/jmj_app/public/app.html';
let appHtml = fs.readFileSync(appFile, 'utf8');
const newVersion = '14.0.' + Date.now();
appHtml = appHtml.replace(/const timestamp = '[\\d\\.]+';/, "const timestamp = '" + newVersion + "';");
fs.writeFileSync(appFile, appHtml);

    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/apply_logic.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/apply_logic.js');
    console.log(res.stdout);
    
    // Bump SW Cache forcibly
    await ssh.execCommand("sed -i 's/CACHE_NAME = \\'tpr-super-cache-v[0-9]*\\'/CACHE_NAME = \\'tpr-super-cache-v140\\'/g' /var/www/jmj_app/public/sw.js");
    
    ssh.dispose();
}
applyLogic().catch(console.error);
