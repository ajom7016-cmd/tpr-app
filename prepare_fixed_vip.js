const fs = require('fs');

// 1. Read the perfectly clean local VIP file
let localVip = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html', 'utf8');

// 2. Fix the subscribeVIP function that was missing
const jsFix = `
<script>
    async function subscribeVIP(vipNumber) {
        try {
            const token = localStorage.getItem('userToken') || (window.parent && window.parent.localStorage.getItem('userToken'));
            if (!token) return alert('Please login first');
            
            // Show loading
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

localVip = localVip.replace(/<script>[\s\S]*?async function loadPage/, jsFix + '\\n    async function loadPage');

// 3. Add the true-bg so it matches the home page background
const realBgStyle = `
<style id="true-bg">
    body {
        background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main_py.jpg') center/cover no-repeat fixed !important;
    }
</style>
</head>
`;
localVip = localVip.replace('</head>', realBgStyle);

// 4. Update the caching timestamp inside the iframe load logic (just in case)
localVip = localVip.replace(/const timestamp = '[^']+'; \/\/ Fixed version string/g, "const timestamp = '" + Date.now() + "'; // Fixed version string");

fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip_fixed.html', localVip);
console.log("Local VIP fixed file generated.");
