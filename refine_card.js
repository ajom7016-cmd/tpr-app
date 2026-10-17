const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // First, extract Badge 42 CSS from vip.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let vipHtml = res.stdout;
    let badgeCss = '';
    const startStr = '/* Badge 42 CSS */';
    const endStr = '/* Keyframes for spinning */';
    if(vipHtml.includes(startStr)) {
        let cssPart = vipHtml.substring(vipHtml.indexOf(startStr));
        badgeCss = cssPart.substring(0, cssPart.indexOf('</style>'));
    }
    
    // Now get glassmorphic_2/code.html
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res2.stdout;
    
    // Inject CSS
    if(!code.includes('/* Badge 42 CSS */')) {
        code = code.replace('</style>', `
    ${badgeCss}
</style>`);
    }
    
    // Slim down the card
    code = code.replace('p-6 mb-6 mt-2', 'p-4 mb-3 mt-1');
    
    // Unhide profile pic and fix shape
    code = code.replace('id="vip-user-pic" src="/assets/default-avatar.png" class="w-6 h-6 rounded-full object-cover hidden"', 'id="vip-user-pic" src="/assets/default-avatar.png" class="w-6 h-6 rounded-full object-cover"');
    
    // Replace the icon area with Badge 42 dynamic HTML
    const oldIconHTML = `
        <!-- Top Row: Icon & User -->
        <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-md border border-white/40">
                <span class="material-symbols-outlined text-white text-[20px]">military_tech</span>
            </div>`;
            
    const newIconHTML = `
        <!-- Top Row: Icon & User -->
        <div class="flex justify-between items-start mb-3">
            \${vipInfo.level === 0 ? \`
            <div class="badge-42-wrap">    <div class="badge-42-glass">        <span class="vip-txt" style="font-size:11px; margin-bottom: 2px;">FREE</span>        <div class="star-row"></div>    </div>    <div class="badge-42-border-wrap">        <div class="badge-42-border"></div>    </div></div>
            \` : \`
            <div class="badge-42-wrap">    <div class="badge-42-glass">        <span class="vip-txt">VIP \${vipInfo.level}</span>        <div class="star-row">
                \${'<span class="material-symbols-outlined b42-star">star</span>'.repeat(vipInfo.level)}
            </div>    </div>    <div class="badge-42-border-wrap">        <div class="badge-42-border"></div>    </div></div>
            \`}
            `;
            
    code = code.replace(oldIconHTML, newIconHTML);
    
    let b64 = Buffer.from(code).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
    console.log("Card refined and Badge 42 added!");
    ssh.dispose();
}
refineCard().catch(console.error);
