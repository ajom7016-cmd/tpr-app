const fs = require('fs');

let content = fs.readFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip_fixed.html', 'utf8');

// 1. Remove the heavy bg-3d block which causes lag on mobile
content = content.replace(/<!-- Premium Animated Background Light -->[\s\S]*?<div class="bg-3d">[\s\S]*?<\/div>/, '');

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

fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip_super_fixed.html', content);
console.log("VIP super fixed file generated.");
