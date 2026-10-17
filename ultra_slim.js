const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ultraSlimCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // The exact HTML I need to replace everything with
    const startMarker = 'const vipTitle = vipInfo.level === 0 ? \'FREE PROFILE\' : \'VIP LEVEL \' + vipInfo.level;';
    const endMarker = '    tasksConfig.forEach(task => {';
    
    if(code.includes(startMarker) && code.includes(endMarker)) {
        const pre = code.substring(0, code.indexOf(startMarker) + startMarker.length);
        const post = code.substring(code.indexOf(endMarker));
        
        const newCard = `
    
    html += \`
    <div class="relative w-full rounded-[20px] overflow-hidden p-3 mb-3 mt-1" style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <!-- Top Row: Icon & User -->
        <div class="flex justify-between items-center mb-1">
            <div class="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
                <span class="material-symbols-outlined text-white text-[16px]">military_tech</span>
            </div>
            
            <div class="flex items-center gap-1.5 bg-white/30 backdrop-blur-md border border-white/40 rounded-full pr-3 pl-1 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                <img id="vip-user-pic" src="/assets/default-avatar.png" onerror="this.style.display='none'" class="w-5 h-5 rounded-full object-cover hidden" />
                <span id="vip-user-name" class="text-white text-[10px] font-black tracking-wider uppercase">USER</span>
            </div>
        </div>
        
        <!-- Middle Text -->
        <div class="mb-1">
            <p class="text-white/70 text-[9px] font-black tracking-[0.2em] uppercase mb-0 leading-tight">VIP STATUS CARD</p>
            <h2 id="vip-level-display" class="text-white text-[28px] font-black leading-none tracking-tight">\${vipTitle}</h2>
        </div>
        
        <!-- Progress Bar Area -->
        <div class="mt-2 bg-white/20 rounded-xl p-2 border border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
            <div class="flex items-end gap-2 mb-1.5">
                <span id="task-progress-text" class="text-white text-[18px] font-black leading-none">\${window.completedTasks || 0}/\${limit}</span>
                <span class="text-white/80 text-[11px] font-bold leading-none mb-0.5">Tasks Completed</span>
            </div>
            <div class="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div id="task-progress-bar" class="h-full rounded-full transition-all duration-500" style="width: 0%; background: linear-gradient(90deg, #ff9a28, #ff5e00);"></div>
            </div>
        </div>
        
        <!-- Bottom Row -->
        <div class="flex items-center gap-4 mt-2 pl-1">
            <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/90 text-[10px] font-bold">Earn Bonus: +0%</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/90 text-[10px] font-bold">Standard User</span>
            </div>
        </div>
    </div>\`;
    
`;
        
        code = pre + newCard + post;
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Ultra Slim Card deployed!");
    } else {
        console.log("Markers not found!");
    }
    
    ssh.dispose();
}
ultraSlimCard().catch(console.error);
