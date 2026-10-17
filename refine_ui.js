const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function refineUI() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // 1. Rewrite showToast to be slim and true glassmorphic
    const toastOld = "toast.className = `transform transition-all duration-300 opacity-0 translate-y-4 max-w-sm w-max bg-white/90 backdrop-blur-xl border border-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] rounded-2xl px-6 py-4 font-bold flex items-center gap-3 ${isError ? 'text-red-500' : 'text-green-500'}`;";
    const toastNew = "toast.className = `transform transition-all duration-300 opacity-0 translate-y-4 max-w-sm w-max bg-white/30 backdrop-blur-md border border-white/40 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-xl px-4 py-2 text-[13px] font-bold flex items-center gap-2 ${isError ? 'text-red-600' : 'text-emerald-600'}`;";
    
    html = html.replace(toastOld, toastNew);
    
    // Make the icon in showToast smaller too
    html = html.replace('<span class="material-symbols-outlined text-[24px]">', '<span class="material-symbols-outlined text-[18px]">');
    
    // 2. Change Google glow from box-shadow to filter: drop-shadow for perfect centering on the G logo itself!
    const glowOld = "googleBtn.style.boxShadow = '0 0 20px rgba(234, 88, 12, 0.6)';";
    const glowNew = "googleBtn.style.filter = 'drop-shadow(0 0 12px rgba(234, 88, 12, 0.8))';";
    html = html.replace(glowOld, glowNew);
    
    const glowOldClear = "googleBtn.style.boxShadow = 'none';";
    const glowNewClear = "googleBtn.style.filter = 'none';";
    html = html.replace(glowOldClear, glowNewClear);
    
    // 3. Make the error text even slimmer in the handleSocialLogin block
    html = html.replace('<span style="color:#334155;font-weight:800;font-size:15px;">${provider} login is unavailable</span><br><span style="color:#ea580c;font-size:13px;margin-top:4px;display:block;font-weight:700;">Please use Google to continue</span>',
                        '<span style="color:#1e293b;font-weight:700;">${provider} login unavailable.</span> <span style="color:#ea580c;font-weight:800;margin-left:4px;">Use Google</span>');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("UI Refined successfully!");
    ssh.dispose();
}
refineUI().catch(console.error);
