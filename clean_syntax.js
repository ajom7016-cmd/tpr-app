const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function cleanSyntaxError() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    const startIndex = html.indexOf('function handleSocialLogin(provider) {');
    const endIndex = html.indexOf('</script>', startIndex);
    
    // I will replace EVERYTHING from startIndex to endIndex with just the correct function!
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
                btn.style.transform = 'translateX(-3px)';
                setTimeout(() => btn.style.transform = 'translateX(3px)', 100);
                setTimeout(() => btn.style.transform = 'translateX(-3px)', 200);
                setTimeout(() => btn.style.transform = 'translateX(0)', 300);
                
                showToast(\`<span style="color:#334155;font-weight:800;font-size:15px;">\${provider} login is unavailable</span><br><span style="color:#ea580c;font-size:13px;margin-top:4px;display:block;font-weight:700;">Please use Google to continue</span>\`, 'error');
                
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
        }\n    `;
        
    html = html.substring(0, startIndex) + newFunc + html.substring(endIndex);
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("Syntax error fixed completely!");
    ssh.dispose();
}
cleanSyntaxError().catch(console.error);
