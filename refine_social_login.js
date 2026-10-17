const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineSocialLogin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Find the exact boundaries
    const startIndex = html.indexOf('function handleSocialLogin(provider) {');
    const endIndex = html.indexOf('}\n\n        ', startIndex) + 11;
    
    if (startIndex !== -1 && html.indexOf('Google login is not ready yet') !== -1) {
        const newFunc = `function handleSocialLogin(provider) {
            const btn = document.getElementById('btn-' + provider.toLowerCase());
            if (!btn) return;
            
            if (provider === 'Google') {
                if (typeof googleTokenClient !== 'undefined') {
                    googleTokenClient.requestAccessToken();
                } else {
                    showToast('Google login is initializing...', 'error');
                }
                return;
            }

            if (provider === 'Apple' || provider === 'Facebook') {
                // Gentle shake
                btn.style.transform = 'translateX(-3px)';
                setTimeout(() => btn.style.transform = 'translateX(3px)', 100);
                setTimeout(() => btn.style.transform = 'translateX(-3px)', 200);
                setTimeout(() => btn.style.transform = 'translateX(0)', 300);
                
                showToast(\`<span style="color:#334155;font-weight:800;font-size:15px;">\${provider} login is unavailable</span><br><span style="color:#ea580c;font-size:13px;margin-top:4px;display:block;font-weight:700;">Please use Google to continue</span>\`, 'error');
                
                // Soft pulsing glow for Google button
                const googleBtn = document.getElementById('btn-google');
                if (googleBtn) {
                    googleBtn.style.transition = 'all 0.4s ease';
                    googleBtn.style.boxShadow = '0 0 20px rgba(234, 88, 12, 0.6)';
                    googleBtn.style.transform = 'scale(1.08)';
                    setTimeout(() => {
                        googleBtn.style.boxShadow = 'none';
                        googleBtn.style.transform = 'scale(1)';
                    }, 2500);
                }
                return;
            }
        }\n\n        `;
        
        html = html.substring(0, startIndex) + newFunc + html.substring(endIndex);
        
        // Cache bust login.html again for PWA by updating manifest start_url
        let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
        let manifestObj = JSON.parse(res2.stdout);
        manifestObj.start_url = "/login.html?v=" + Date.now();
        let b64m = Buffer.from(JSON.stringify(manifestObj)).toString('base64');
        await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
        console.log("Refined handleSocialLogin and busted manifest!");
    } else {
        console.log("Could not find boundaries!");
    }
    ssh.dispose();
}
refineSocialLogin().catch(console.error);
