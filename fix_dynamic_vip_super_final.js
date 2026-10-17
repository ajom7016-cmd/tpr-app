const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDynamicVipSuperFinal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let content = r.stdout;
    
    // Remove the old dynamic script
    content = content.replace(/<script>\s*async function updateVipUI\(\)[\s\S]*?<\/script>/, '');
    
    // Inject the bulletproof dynamic script with try-catch for localStorage
    const dynamicScript = `
<script>
    async function updateVipUI() {
        try {
            let token = null;
            try { token = localStorage.getItem('userToken'); } catch(e) {}
            if (!token && window.parent) {
                try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
            }
            if (!token) return;
            
            const res = await fetch('/api/profile', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await res.json();
            
            if (data && data.id !== undefined) {
                let userVip = 0;
                if (data.vip_plan) {
                    if (data.vip_plan.toLowerCase() === 'free' || data.vip_plan === 'VIP 0') userVip = 0;
                    else {
                        let match = data.vip_plan.match(/\\d+/);
                        if (match) userVip = parseInt(match[0]);
                    }
                }
                
                const cards = document.querySelectorAll('.stagger-root > div.glass-card, .stagger-root > div.glass-card-premium');
                
                cards.forEach((card, index) => {
                    const btn = card.querySelector('button');
                    if (!btn) return;
                    
                    if (index === userVip) {
                        btn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Current Plan</span>';
                        btn.style.background = 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
                        btn.style.boxShadow = 'none';
                        btn.className = 'w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md';
                        btn.onclick = () => alert('You are already on this plan!');
                        card.style.boxShadow = '0 0 0 2px #22c55e, 0 15px 35px rgba(0,0,0,0.05), inset 0 2px 10px rgba(255,255,255,0.3)';
                    } else if (index < userVip) {
                        btn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Expired</span>';
                        btn.style.background = 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';
                        btn.style.boxShadow = 'none';
                        btn.className = 'w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md';
                        btn.onclick = () => alert('You have a better plan active!');
                        card.style.opacity = '0.7';
                        card.style.filter = 'grayscale(0.5)';
                    } else {
                        // Reset anything if it was wrongly hardcoded
                        if (index !== 0 && btn.innerHTML.includes('Current Plan')) {
                            // This shouldn't happen based on our HTML structure, but just in case
                        } else if (index === 0 && userVip > 0) {
                             btn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Expired</span>';
                             btn.style.background = 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';
                             card.style.opacity = '0.7';
                             card.style.filter = 'grayscale(0.5)';
                        }
                    }
                });
            }
        } catch(e) {
            console.error(e);
        }
    }
    updateVipUI();
</script>
`;
    content = content.replace('</body>', dynamicScript + '\n</body>');
    
    let b64 = Buffer.from(content).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
    
    // Cache bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    await ssh.execCommand(`node -e "const fs = require('fs'); let swPath = '/var/www/jmj_app/public/sw.js'; let sw = fs.readFileSync(swPath, 'utf8'); sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, \\"const CACHE_NAME = 'tpr-super-cache-\\" + Date.now() + \\"';\\"); fs.writeFileSync(swPath, sw);"`);
    
    console.log("VIP updated with try-catch for token!");
    ssh.dispose();
}
fixDynamicVipSuperFinal().catch(console.error);
