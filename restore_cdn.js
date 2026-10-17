const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Restoring Tailwind CDN and adding Preloader...");
    
    // The fast preloader that hides after 1.5s max
    const preloaderHtmlBase = `
<div id="tpr-global-preloader" style="position: fixed; inset: 0; z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: opacity 0.4s ease-out;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #e0f2fe, #f0fdf4); border-radius: 20px; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <span style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 28px; background: linear-gradient(135deg, #38bdf8, #4ade80); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TPR</span>
    </div>
    <div style="width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #f97316; border-radius: 50%; animation: tpr-spin 1s linear infinite;"></div>
    <style>@keyframes tpr-spin { to { transform: rotate(360deg); } }</style>
    <script>
        (function() {
            let done = false;
            function hidePreloader() {
                if(done) return;
                done = true;
                const p = document.getElementById('tpr-global-preloader');
                if(p) { p.style.opacity = '0'; setTimeout(() => p.remove(), 400); }
            }
            window.addEventListener('load', () => setTimeout(hidePreloader, 300));
            setTimeout(hidePreloader, 1500); // Bulletproof fallback
        })();
    </script>
</div>
`;

    const resFiles = await ssh.execCommand("find /var/www/jmj_app/public -name '*.html'");
    const files = resFiles.stdout.split('\n').filter(Boolean);
    
    for (let file of files) {
        let contentRes = await ssh.execCommand(`cat "${file}"`);
        let content = contentRes.stdout;
        let original = content;
        
        // Remove compiled CSS link
        content = content.replace(/<link rel="stylesheet" href="\/assets\/tailwind-compiled\.css[^>]*>/gi, '');
        
        // Add Tailwind CDN if missing
        if (!content.includes('cdn.tailwindcss.com')) {
            const cdnLink = `<script src="https://cdn.tailwindcss.com"></script>`;
            if (content.includes('</head>')) {
                content = content.replace('</head>', `    ${cdnLink}\n</head>`);
            } else {
                content = cdnLink + '\n' + content;
            }
        }
        
        // Add preloader to main files (app.html, index.html)
        if (file.endsWith('/app.html') || file.endsWith('/index.html')) {
            // Remove old preloader if any exists just in case
            while(content.includes('id="tpr-global-preloader"')) {
                const s = content.indexOf('<div id="tpr-global-preloader"');
                const e = content.indexOf('</script>\n</div>', s) + 16;
                if(e > 16) { content = content.substring(0, s) + content.substring(e); }
                else { break; } // Safe exit
            }
            
            const isDark = file.endsWith('index.html');
            const bgStr = isDark ? 'background: #0b0f19;' : 'background: #ffffff;';
            const preloaderFinal = preloaderHtmlBase.replace('z-index: 999999;', `z-index: 999999; ${bgStr}`);
            
            content = content.replace(/<body[^>]*>/, match => match + '\n' + preloaderFinal);
        }
        
        if (content !== original) {
            let b64 = Buffer.from(content).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > "${file}"`);
            console.log(`Restored ${file}`);
        }
    }

    console.log("Tailwind CDN and Preloaders restored perfectly!");
    ssh.dispose();
}
fix().catch(console.error);
