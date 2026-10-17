const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceReplaceSocial() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Find the exact boundaries
    const startIndex = html.indexOf('function handleSocialLogin(provider) {');
    // Find the end of this function. It's the last function in the script block probably, or followed by another function.
    const nextFuncIndex = html.indexOf('function ', startIndex + 10);
    const endIndex = nextFuncIndex !== -1 ? html.lastIndexOf('}', nextFuncIndex) + 1 : html.lastIndexOf('</script>');
    
    if (startIndex !== -1 && endIndex !== -1) {
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
                
                showToast(\`🚨 \${provider} Server is Jammed!<br><span style="color:#ea580c;font-size:14px;margin-top:6px;display:block;font-weight:900;">Please Continue with Google instead.</span>\`, 'error');
                
                // Highlight Google button
                const googleBtn = document.getElementById('btn-google');
                if (googleBtn) {
                    googleBtn.style.boxShadow = '0 0 0 4px #f97316';
                    googleBtn.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        googleBtn.style.boxShadow = '';
                        googleBtn.style.transform = '';
                    }, 2500);
                }
                return;
            }
        }\n\n        `;
        
        html = html.substring(0, startIndex) + newFunc + html.substring(endIndex);
        
        let b64 = Buffer.from(html).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
        console.log("Successfully replaced handleSocialLogin!");
    } else {
        console.log("Could not find boundaries!");
    }
    ssh.dispose();
}
forceReplaceSocial().catch(console.error);
