const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function rewriteSocialLogin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Find handleSocialLogin function and replace it completely
    const startIdx = html.indexOf('function handleSocialLogin(provider) {');
    const endStr = "                window.location.href = '/mock_oauth.html?provider=' + provider;\n            }\n        }";
    const endIdx = html.indexOf(endStr) + endStr.length;
    
    const newFunc = `function handleSocialLogin(provider) {
            const btn = document.getElementById('btn-' + provider.toLowerCase());
            if (!btn) return;
            
            if (provider === 'Google') {
                if (typeof googleTokenClient !== 'undefined') {
                    googleTokenClient.requestAccessToken();
                } else {
                    showToast('Google login is not ready yet.', 'error');
                }
                return;
            }

            if (provider === 'Apple' || provider === 'Facebook') {
                // Shake the button
                btn.style.transform = 'translateX(-5px)';
                setTimeout(() => btn.style.transform = 'translateX(5px)', 100);
                setTimeout(() => btn.style.transform = 'translateX(-5px)', 200);
                setTimeout(() => btn.style.transform = 'translateX(0)', 300);
                
                showToast(\`🚨 \${provider} Server is Jammed!<br><span class="text-orange-600 text-sm mt-1 block font-extrabold">Please Continue with Google instead.</span>\`, 'error');
                
                // Highlight Google button
                const googleBtn = document.getElementById('btn-google');
                if (googleBtn) {
                    googleBtn.classList.add('ring-4', 'ring-orange-500', 'ring-offset-2', 'scale-110');
                    setTimeout(() => {
                        googleBtn.classList.remove('ring-4', 'ring-orange-500', 'ring-offset-2', 'scale-110');
                    }, 2000);
                }
                return;
            }
        }`;
        
    html = html.substring(0, startIdx) + newFunc + html.substring(endIdx);
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("handleSocialLogin updated successfully!");
    ssh.dispose();
}
rewriteSocialLogin().catch(console.error);
