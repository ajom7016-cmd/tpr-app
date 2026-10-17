const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixVip() {
    console.log("Reading pristine vip.html...");
    let vipHtml = fs.readFileSync('C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\public\\investment_premium_glass\\vip.html', 'utf8');

    // 1. Remove ONLY the .bg-3d block up to the header
    const startTag = '<div class="bg-3d">';
    const endTag = '<div class="px-6 pb-2">';
    const startIndex = vipHtml.indexOf(startTag);
    const endIndex = vipHtml.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
        console.log("Safely sliced out .bg-3d block!");
        vipHtml = vipHtml.substring(0, startIndex) + '<!-- Clean Background -->\r\n\r\n    ' + vipHtml.substring(endIndex);
    } else {
        throw new Error("Could not find start or end tags for .bg-3d");
    }

    // 2. Remove CSS for bg-3d, orbs, bg-blocks, float keyframe
    vipHtml = vipHtml.replace(/\/\* Ultra Premium Animated 3D Background - Light Mode \*\/[\s\S]*?@keyframes float[\s\S]*?\}\s*\}/, '');
    vipHtml = vipHtml.replace(/\/\* Glassmorphic 3D blocks in background \*\/[\s\S]*?\.bg-block-2\s*\{[\s\S]*?\}/, '');

    // 3. Remove opacity: 0 from body CSS
    vipHtml = vipHtml.replace(/opacity:\s*0;/g, '');

    // 4. Set body background to transparent
    vipHtml = vipHtml.replace(/background-color:\s*#f1f5f9;/, 'background-color: transparent !important;');
    vipHtml = vipHtml.replace(/<body[^>]*>/, '<body class="pb-6 relative overflow-x-hidden text-slate-800" style="background: transparent !important;">');

    // 5. Fix card spacing and heights so buttons never overlap
    // Change h-[225px] on VIP 1-6 to min-h-[245px] pb-8 mb-14
    vipHtml = vipHtml.replace(/h-\[225px\](?!\s*mb-12)/g, 'min-h-[245px] pb-8 mb-14');
    vipHtml = vipHtml.replace(/h-\[225px\] mb-12/g, 'min-h-[245px] pb-8 mb-14');
    vipHtml = vipHtml.replace(/space-y-12/g, 'space-y-14');

    // 6. Verify key elements still exist:
    const checks = [
        'Upgrade to Premium VIP',
        'Free Plan',
        'VIP 1',
        'VIP 2',
        'VIP 3',
        'VIP 4',
        'VIP 5',
        'VIP 6'
    ];

    for (let check of checks) {
        if (!vipHtml.includes(check)) {
            throw new Error(`CRITICAL INTEGRITY CHECK FAILED: Missing "${check}"`);
        }
    }
    console.log("All integrity checks PASSED!");

    // 7. Inject active plan status script before </body>
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

    const outPath = 'C:\\Users\\ajom7\\Downloads\\TPR\\JMJ_App\\vip_perfect.html';
    fs.writeFileSync(outPath, vipHtml, 'utf8');
    console.log("Wrote perfectly intact vip_perfect.html!");

    // 8. Upload to live server
    console.log("Connecting to SSH...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Uploading to /var/www/jmj_app/public/investment_premium_glass/vip.html...");
    await ssh.putFile(outPath, '/var/www/jmj_app/public/investment_premium_glass/vip.html');

    console.log("Uploading to /var/www/jmj_app/public/investment_premium_glass/vip_final.html...");
    await ssh.putFile(outPath, '/var/www/jmj_app/public/investment_premium_glass/vip_final.html');

    await ssh.execCommand('chmod 644 /var/www/jmj_app/public/investment_premium_glass/vip.html');
    await ssh.execCommand('chmod 644 /var/www/jmj_app/public/investment_premium_glass/vip_final.html');

    console.log("SUCCESSFULLY DEPLOYED CLEAN, PERFECT VIP PAGE!");
    ssh.dispose();
}

fixVip().catch(err => {
    console.error("ERROR:", err);
    process.exit(1);
});
