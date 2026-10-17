const fs = require('fs');

// 1. Get the pristine layout from the local zip
let content = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', 'utf8');

// 2. Strip bg-3d properly for performance
const bg3dBlock = `
    <!-- Premium Animated Background Light -->
    <div class="bg-3d">
        <div class="orb-1"></div>
        <div class="orb-2"></div>
        <div class="bg-block-1"></div>
        <div class="bg-block-2"></div>
    </div>
`;
content = content.replace(bg3dBlock, '');

// 3. Performance tweaks (blur 8px)
content = content.replace(/backdrop-filter:\s*blur\(40px\)/g, 'backdrop-filter: blur(8px)');
content = content.replace(/-webkit-backdrop-filter:\s*blur\(40px\)/g, '-webkit-backdrop-filter: blur(8px)');

// 4. Stagger animation
content = content.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');
const animCSS = `
<style id="stagger-anim">
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(30px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
.stagger-root > div {
    animation: popUpStagger 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both !important;
    will-change: transform, opacity;
}
.stagger-root > *:nth-child(1) { animation-delay: 0.08s !important; }
.stagger-root > *:nth-child(2) { animation-delay: 0.15s !important; }
.stagger-root > *:nth-child(3) { animation-delay: 0.22s !important; }
.stagger-root > *:nth-child(4) { animation-delay: 0.29s !important; }
.stagger-root > *:nth-child(5) { animation-delay: 0.36s !important; }
</style>
`;
// Ensure we inject using \n string, not \\n literal
content = content.replace('</head>', animCSS + '\n</head>');

// 5. Global background
const realBgStyle = `
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
`;
content = content.replace('</head>', realBgStyle + '\n</head>');

// 6. Inject the ORIGINAL dynamic script extracted from debug_vip.html
const originalDynamicScript = `
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
        } catch(e) { console.log(e); }
    });
`;

// Inject into the existing <script> tag
content = content.replace('</script>', originalDynamicScript + '\n    </script>');

fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip_ultimate_restoration.html', content);
console.log("Ultimate restoration file generated locally.");
