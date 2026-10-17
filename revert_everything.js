const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');
async function revertEverything() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Revert Profile Page
    let originalProfile = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/user_profile_premium_glass/code.html', 'utf8');
    let b64Profile = Buffer.from(originalProfile).toString('base64');
    await ssh.execCommand(`echo "${b64Profile}" | base64 -d > /var/www/jmj_app/public/user_profile_premium_glass/code.html`);
    console.log("Profile page reverted to original zip version.");

    // 2. Revert VIP Page (but keep the bg-3d removal so it doesn't lag)
    let originalVip = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', 'utf8');
    
    // Strip bg-3d block perfectly
    const bg3dBlock = `
    <!-- Premium Animated Background Light -->
    <div class="bg-3d">
        <div class="orb-1"></div>
        <div class="orb-2"></div>
        <div class="bg-block-1"></div>
        <div class="bg-block-2"></div>
    </div>
`;
    originalVip = originalVip.replace(bg3dBlock, '');
    
    // Reduce blur
    originalVip = originalVip.replace(/backdrop-filter:\s*blur\(40px\)/g, 'backdrop-filter: blur(8px)');
    originalVip = originalVip.replace(/-webkit-backdrop-filter:\s*blur\(40px\)/g, '-webkit-backdrop-filter: blur(8px)');
    
    // Stagger animation
    originalVip = originalVip.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');
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
    originalVip = originalVip.replace('</head>', animCSS + '\n</head>');
    
    // Add background matching the home page
    const realBgStyle = `
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
</head>
`;
    originalVip = originalVip.replace('</head>', realBgStyle);
    
    let b64Vip = Buffer.from(originalVip).toString('base64');
    await ssh.execCommand(`echo "${b64Vip}" | base64 -d > /var/www/jmj_app/public/investment_premium_glass/vip.html`);
    console.log("VIP page reverted to original zip version (but optimized).");
    
    // 3. Global Cache Bust
    await ssh.execCommand(`node -e "const fs = require('fs'); let f = '/var/www/jmj_app/public/app.html'; let a = fs.readFileSync(f, 'utf8'); a = a.replace(/const currentVersion = '[^']+';/, \\"const currentVersion = 'v\\" + Date.now() + \\"';\\"); fs.writeFileSync(f, a);"`);
    await ssh.execCommand(`node -e "const fs = require('fs'); let swPath = '/var/www/jmj_app/public/sw.js'; let sw = fs.readFileSync(swPath, 'utf8'); sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, \\"const CACHE_NAME = 'tpr-super-cache-\\" + Date.now() + \\"';\\"); fs.writeFileSync(swPath, sw);"`);
    console.log("Caches busted.");
    
    ssh.dispose();
}
revertEverything().catch(console.error);
