const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function restoreCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // We need to inject the VIP card HTML into the `html` string at the beginning of generateTasks.
    const hook = "let html = '';";
    
    const cardHTML = `
    const vipTitle = vipInfo.level === 0 ? 'FREE PROFILE' : 'VIP LEVEL ' + vipInfo.level;
    
    html += \`
    <div class="relative w-full rounded-[24px] overflow-hidden p-6 mb-6 mt-2" style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        <!-- Top Row: Icon & User -->
        <div class="flex justify-between items-start mb-4">
            <div class="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-md border border-white/40">
                <span class="material-symbols-outlined text-white text-[20px]">military_tech</span>
            </div>
            
            <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full pr-3 pl-1 py-1">
                <img id="vip-user-pic" src="/assets/default-avatar.png" class="w-6 h-6 rounded-full object-cover hidden" />
                <span id="vip-user-name" class="text-white text-[10px] font-black tracking-wider uppercase">USER</span>
            </div>
        </div>
        
        <!-- Middle Text -->
        <div class="mb-2">
            <p class="text-white/70 text-[10px] font-black tracking-[0.2em] uppercase mb-0">VIP STATUS CARD</p>
            <h2 id="vip-level-display" class="text-white text-[36px] font-black leading-none tracking-tight">\${vipTitle}</h2>
        </div>
        
        <!-- Progress Bar Area -->
        <div class="mt-4 bg-white/10 rounded-xl p-3 border border-white/20">
            <div class="flex items-end gap-2 mb-2">
                <span id="task-progress-text" class="text-white text-[20px] font-black leading-none">\${window.completedTasks || 0}/\${limit}</span>
                <span class="text-white/70 text-[13px] font-bold leading-none mb-0.5">Tasks Completed</span>
            </div>
            <div class="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div id="task-progress-bar" class="h-full rounded-full transition-all duration-500" style="width: 0%; background: linear-gradient(90deg, #ff9a28, #ff5e00);"></div>
            </div>
        </div>
        
        <!-- Bottom Row -->
        <div class="flex items-center gap-4 mt-3">
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/80 text-[11px] font-bold">Earn Bonus: +0%</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/80 text-[11px] font-bold">Standard User</span>
            </div>
        </div>
    </div>\`;
    `;
    
    if(code.includes(hook)) {
        code = code.replace(hook, hook + "\n" + cardHTML);
        // Also remove the old vip-level-display setting at the end of the function since it's now dynamically injected
        code = code.replace(/document\.getElementById\('vip-level-display'\)\.innerText = [^;]+;/, '');
        code = code.replace(/document\.getElementById\('task-progress-text'\)\.innerText = [^;]+;/, '');
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Card Restored!");
    } else {
        console.log("Hook not found!");
    }
    
    ssh.dispose();
}
restoreCard().catch(console.error);
