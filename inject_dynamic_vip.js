const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function injectDynamicVip() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let content = r.stdout;
    
    // We only inject if it's not already there to prevent duplicates
    if (!content.includes('function updateVipUI')) {
        const dynamicScript = `
<script>
    async function updateVipUI() {
        try {
            const token = localStorage.getItem('userToken') || (window.parent && window.parent.localStorage.getItem('userToken'));
            if (!token) return;
            
            const res = await fetch('/api/profile', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const data = await res.json();
            if (data.id !== undefined) {
                const userVip = data.vip_plan || 0;
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
                        
                        // Add an active glow to the card
                        card.style.boxShadow = '0 0 0 2px #22c55e, 0 15px 35px rgba(0,0,0,0.05), inset 0 2px 10px rgba(255,255,255,0.3)';
                    } else if (index < userVip) {
                        btn.innerHTML = '<span class="text-[15px] font-black tracking-wide">Expired</span>';
                        btn.style.background = 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';
                        btn.style.boxShadow = 'none';
                        btn.className = 'w-full rounded-[99px] py-2.5 flex justify-center items-center text-white font-bold transition-transform active:scale-95 shadow-md';
                        btn.onclick = () => alert('You have a better plan active!');
                        card.style.opacity = '0.7';
                        card.style.filter = 'grayscale(0.5)';
                    } else if (index > userVip) {
                        // Make sure VIP 0 says Upgrade if user has 0 but we want them to upgrade? No, VIP 0 is always index 0. If userVip is 0, then index > 0 are all > userVip. They stay as "Subscribe Now".
                        // Wait, what if index is 0 but userVip > 0? That is handled by index < userVip above (Expired).
                    }
                });
            }
        } catch(e) {
            console.error('Failed to update VIP UI', e);
        }
    }
    
    // Call it immediately
    updateVipUI();
</script>
`;
        // Insert right before </body>
        content = content.replace('</body>', dynamicScript + '\n</body>');
        
        let b64 = Buffer.from(content).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
        
        // Cache bust
        await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
        await ssh.execCommand('sed -i "s/v1.0.[0-9]*/v1.0.999$(date +%s)/g" /var/www/jmj_app/public/sw.js');
        
        console.log("Dynamic logic injected and cache busted!");
    } else {
        console.log("Already injected.");
    }
    ssh.dispose();
}
injectDynamicVip().catch(console.error);
