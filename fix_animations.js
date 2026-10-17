const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAnimations() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const pages = [
        '/var/www/jmj_app/public/glassmorphic_1/code.html',
        '/var/www/jmj_app/public/glassmorphic_2/code.html',
        '/var/www/jmj_app/public/investment_premium_glass/vip_final.html',
        '/var/www/jmj_app/public/user_profile_premium_glass/code_final.html',
        '/var/www/jmj_app/public/glassmorphic_3/code.html'
    ];
    
    const keyframes = `
<style id="stagger-keyframes">
@keyframes popUpStagger {
    0% { opacity: 0; transform: translateY(30px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
`;

    for (let page of pages) {
        console.log("Fixing keyframes on", page);
        // Clean any existing injected keyframes just in case
        await ssh.execCommand(`sed -i '/<style id="stagger-keyframes">/,/<\\/style>/d' ${page}`);
        
        // Let's use sed to inject before </head>
        // Because sed can be tricky with newlines, we'll do it in a safe way
        const safeKeyframes = keyframes.replace(/\\n/g, '\\\\n');
        await ssh.execCommand(`sed -i 's/<\\/head>/${safeKeyframes}<\\/head>/' ${page}`);
    }
    
    // Also, remember vip_final.html has that broken script tag? Let's fix it!
    // <script src="https://cdn.tailwindcss.com"> window.addEventListener...
    console.log("Fixing VIP broken script tag...");
    await ssh.execCommand(`sed -i 's/<script src="https:\\/\\/cdn.tailwindcss.com">\\s*window.addEventListener/<script src="https:\\/\\/cdn.tailwindcss.com"><\\/script>\\n<script>\\nwindow.addEventListener/g' /var/www/jmj_app/public/investment_premium_glass/vip_final.html`);
    
    // Let's also bump the cache!
    const v = "v_anim_" + Date.now();
    await ssh.execCommand(`sed -i "s/const currentVersion = '[^']*';/const currentVersion = '${v}';/g" /var/www/jmj_app/public/app.html`);
    await ssh.execCommand(`sed -i "s/const CACHE_NAME = 'tpr-super-cache-[^']*';/const CACHE_NAME = 'tpr-super-cache-${v}';/g" /var/www/jmj_app/public/sw.js`);
    
    console.log("Done!");
    ssh.dispose();
}
fixAnimations().catch(console.error);
