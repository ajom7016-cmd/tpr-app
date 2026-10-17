const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });

    console.log("Injecting White Background 3D Spinner everywhere...");
    
    // The HTML/CSS for the White Background Premium Spinner
    const spinnerHtmlWhite = `
<div id="tpr-global-preloader" style="position: fixed; inset: 0; z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: opacity 0.4s ease-out; background-color: #ffffff;">
    <div style="position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        <!-- Orange and Cyan colors running inside -->
        <div style="position: absolute; width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(from 0deg, transparent 0%, rgba(255,138,0,0) 10%, #00d2ff 45%, #ff8a00 90%, transparent 100%); animation: tpr-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; filter: blur(12px); z-index: 1;"></div>
        <!-- 3D Glass Pipe -->
        <div style="position: absolute; width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: inset 0 6px 15px rgba(255, 255, 255, 1), inset 0 -4px 10px rgba(0, 0, 0, 0.05), 0 15px 30px rgba(0, 210, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.8); z-index: 2;"></div>
        <!-- Hollow White Center -->
        <div style="position: absolute; width: 70px; height: 70px; border-radius: 50%; background-color: #ffffff; box-shadow: inset 0 6px 10px rgba(0, 0, 0, 0.08), 0 -2px 5px rgba(255, 255, 255, 1); border: 1px solid rgba(0, 0, 0, 0.03); z-index: 3;"></div>
    </div>
    <div style="text-align: center; font-family: 'Outfit', sans-serif;">
        <h2 style="font-size: 20px; font-weight: 500; color: #1a1a1a; margin: 0 0 5px 0; letter-spacing: -0.5px;">Loading...</h2>
        <p style="font-size: 13px; color: #888; margin: 0;">TPR Experience</p>
    </div>
    <style>@keyframes tpr-spin { 100% { transform: rotate(360deg); } }</style>
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

    async function forceWhiteSpinner(filepath) {
        let res = await ssh.execCommand(`cat ${filepath}`);
        let html = res.stdout;
        let original = html;
        
        // Remove any old preloader remnants
        while(html.includes('id="tpr-global-preloader"')) {
            const s = html.indexOf('<div id="tpr-global-preloader"');
            const e = html.indexOf('</script>\n</div>', s) + 16;
            if(e > 16) { html = html.substring(0, s) + html.substring(e); }
            else { break; }
        }

        // Add the pure white 3D spinner
        html = html.replace(/<body[^>]*>/, match => match + '\n' + spinnerHtmlWhite);
        
        if (html !== original) {
            let b64 = Buffer.from(html).toString('base64');
            await ssh.execCommand(`echo "${b64}" | base64 -d > ${filepath}`);
            console.log(`Forced white spinner on ${filepath}`);
        }
    }

    await forceWhiteSpinner('/var/www/jmj_app/public/app.html');
    await forceWhiteSpinner('/var/www/jmj_app/public/index.html');

    console.log("White 3D Spinners applied successfully to the live server!");
    ssh.dispose();
}
fix().catch(console.error);
