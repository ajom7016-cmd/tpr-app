const fs = require('fs');

let content = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', 'utf8');

// 1. Properly delete the ENTIRE bg-3d block by string replacement
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

// 2. Reduce blur(40px) to blur(8px) for performance
content = content.replace(/backdrop-filter:\s*blur\(40px\)/g, 'backdrop-filter: blur(8px)');
content = content.replace(/-webkit-backdrop-filter:\s*blur\(40px\)/g, '-webkit-backdrop-filter: blur(8px)');

// 3. Add stagger-root class to the container
content = content.replace('<div class="px-5 mt-4 space-y-12">', '<div class="px-5 mt-4 space-y-12 stagger-root">');

// 4. Inject the animation CSS if it's not there
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
if (!content.includes('id="stagger-anim"')) {
    content = content.replace('</head>', animCSS + '\\n</head>');
}

// 5. Fix the subscribeVIP function that was missing
const jsFix = `
<script>
    async function subscribeVIP(vipNumber) {
        try {
            const token = localStorage.getItem('userToken') || (window.parent && window.parent.localStorage.getItem('userToken'));
            if (!token) return alert('Please login first');
            
            const btn = event.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span> Processing...';
            
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ vipLevel: vipNumber })
            });
            const data = await res.json();
            
            if (data.success) {
                alert('Congratulations! Successfully upgraded to VIP ' + vipNumber);
                if (window.parent) window.parent.location.reload();
                else window.location.reload();
            } else {
                alert(data.error || 'Failed to upgrade');
                btn.innerHTML = originalText;
            }
        } catch(e) {
            alert('Error upgrading VIP');
        }
    }
`;

content = content.replace(/<script>[\s\S]*?async function loadPage/, jsFix + '\\n    async function loadPage');

// 6. Add the true-bg so it matches the home page background
const realBgStyle = `
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
</head>
`;
content = content.replace('</head>', realBgStyle);

// 7. Update the caching timestamp inside the iframe load logic (just in case)
content = content.replace(/const timestamp = '[^']+'; \/\/ Fixed version string/g, "const timestamp = '" + Date.now() + "'; // Fixed version string");

fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip_final_perfect.html', content);
console.log("VIP final perfect file generated.");
