const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function rewriteClean() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    const startMarker = "async function generateTasks() {";
    const endMarker = "// Set username dynamically for the new VIP card";
    
    if(code.includes(startMarker) && code.includes(endMarker)) {
        const pre = code.substring(0, code.indexOf(startMarker));
        const post = code.substring(code.indexOf(endMarker));
        
        const newFunc = `
async function generateTasks() {
    window.completedTasks = window.completedTasks || 0;
    const vipInfo = (window.APP && typeof window.APP.getUserVip === 'function') ? window.APP.getUserVip() : { level: 0, planName: 'Free', dailyTasks: 1, dailyEarning: 10 };
    window.vipLevelGlobal = vipInfo.level;
    const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};
    const limit = limitMap[vipInfo.level] || 1;
    let dynamicReward = (vipInfo.dailyEarning / limit).toFixed(2);
    
    let limits = { youtube: 0, facebook: 0, telegram: 0, tiktok: 0 };
    if(limit === 1) { limits.youtube = 1; }
    else if(limit === 4) { limits.youtube=1; limits.facebook=1; limits.telegram=1; limits.tiktok=1; }
    else if(limit === 6) { limits.youtube=2; limits.facebook=2; limits.telegram=1; limits.tiktok=1; }
    else if(limit === 8) { limits.youtube=2; limits.facebook=2; limits.telegram=2; limits.tiktok=2; }
    else if(limit === 10) { limits.youtube=3; limits.facebook=3; limits.telegram=2; limits.tiktok=2; }
    else if(limit === 12) { limits.youtube=3; limits.facebook=3; limits.telegram=3; limits.tiktok=3; }
    else if(limit === 14) { limits.youtube=4; limits.facebook=4; limits.telegram=3; limits.tiktok=3; }
    
    const tasksConfig = [
        { id: 1, key: 'youtube', title: 'YouTube Video', iconPath: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
        { id: 2, key: 'facebook', title: 'Facebook Page', iconPath: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
        { id: 3, key: 'telegram', title: 'Telegram Channel', iconPath: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#0088cc"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.676c.223-.198-.054-.31-.35-.11l-6.4 4.024-2.76-.86c-.6-.188-.614-.6.126-.89l10.814-4.17c.5-.195.945.116.786.89l.464-.55z"/></svg>' },
        { id: 4, key: 'tiktok', title: 'TikTok Follow', iconPath: '<svg viewBox="0 0 24 24" width="24" height="24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v5.8c-.04 1.63-.51 3.23-1.4 4.58-1.22 1.83-3.23 3.09-5.46 3.32-2.32.24-4.75-.24-6.6-1.62-1.9-1.41-3.08-3.66-3.13-6.04-.05-2.58 1.17-5.06 3.16-6.64 2.11-1.67 5.01-2.12 7.56-1.26.15.05.29.11.44.17v4.06c-1.52-.45-3.25-.26-4.59.56-1.29.79-2.11 2.22-2.13 3.75-.02 1.48.72 2.89 1.95 3.65 1.12.69 2.56.88 3.82.52 1.57-.45 2.72-1.87 2.87-3.52.01-.13.01-.26.01-.39V.02z"/></svg>' }
    ];
    
    let html = '';
    const vipTitle = vipInfo.level === 0 ? 'FREE PROFILE' : 'VIP LEVEL ' + vipInfo.level;
    
    html += \`
    <div class="relative w-full rounded-[24px] overflow-hidden p-4 mb-3 mt-1" style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <!-- Top Row: Icon & User -->
        <div class="flex justify-between items-start mb-3">
            \${vipInfo.level === 0 ? \`
            <div class="badge-42-wrap" style="transform: scale(0.9); transform-origin: top left;">    
                <div class="badge-42-glass">        
                    <span class="vip-txt" style="font-size:11px; margin-bottom: 2px;">FREE</span>        
                    <div class="star-row"></div>    
                </div>    
                <div class="badge-42-border-wrap">        
                    <div class="badge-42-border"></div>    
                </div>
            </div>
            \` : \`
            <div class="badge-42-wrap" style="transform: scale(0.9); transform-origin: top left;">    
                <div class="badge-42-glass">        
                    <span class="vip-txt">VIP \${vipInfo.level}</span>        
                    <div class="star-row">
                        \${'<span class="material-symbols-outlined b42-star">star</span>'.repeat(vipInfo.level)}
                    </div>    
                </div>    
                <div class="badge-42-border-wrap">        
                    <div class="badge-42-border"></div>    
                </div>
            </div>
            \`}
            
            <div class="flex items-center gap-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full pr-3 pl-1 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.05)] h-8">
                <img id="vip-user-pic" src="" style="display:none;" class="w-6 h-6 rounded-full object-cover" />
                <span id="vip-user-name" class="text-white text-[12px] font-black tracking-wider uppercase">USER</span>
            </div>
        </div>
        
        <!-- Middle Text -->
        <div class="mb-1">
            <p class="text-white/70 text-[10px] font-black tracking-[0.2em] uppercase mb-0">VIP STATUS CARD</p>
            <h2 id="vip-level-display" class="text-white text-[36px] font-black leading-none tracking-tight">\${vipTitle}</h2>
        </div>
        
        <!-- Progress Bar Area -->
        <div class="mt-3 bg-white/20 rounded-xl p-3 border border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
            <div class="flex items-end gap-2 mb-2">
                <span id="task-progress-text" class="text-white text-[20px] font-black leading-none">\${window.completedTasks || 0}/\${limit}</span>
                <span class="text-white/80 text-[13px] font-bold leading-none mb-0.5">Tasks Completed</span>
            </div>
            <div class="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                <div id="task-progress-bar" class="h-full rounded-full transition-all duration-500" style="width: 0%; background: linear-gradient(90deg, #ff9a28, #ff5e00);"></div>
            </div>
        </div>
        
        <!-- Bottom Row -->
        <div class="flex items-center gap-4 mt-3 pl-1">
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/90 text-[11px] font-bold">Earn Bonus: +0%</span>
            </div>
            <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-[#ff5e00] shadow-[0_0_8px_#ff5e00]"></div>
                <span class="text-white/90 text-[11px] font-bold">Standard User</span>
            </div>
        </div>
    </div>\`;
    
    tasksConfig.forEach(task => {
        let pLimit = limits[task.key];
        
        html += \`
        <div class="relative bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center justify-between" style="border-radius: 20px;">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]">
                    \${task.iconPath}
                </div>
                <div>
                    <h3 class="text-white font-bold text-[15px]">\${task.title}</h3>
                    <p id="task-limit-\${task.id}" data-limit="\${pLimit}" class="text-white/50 text-[10px] font-bold tracking-wider mt-0.5 uppercase">\${pLimit} TASKS TODAY</p>
                </div>
            </div>
            <div class="flex flex-col items-end gap-1">
                <span class="text-white font-black text-[15px] tracking-tight">৳ \${dynamicReward} <span class="text-white/50 text-[10px] font-medium tracking-normal">/task</span></span>
                \` + (pLimit > 0 ? \`
                <button onclick="startMultiTask(\${task.id}, \${dynamicReward})" id="btn-task-\${task.id}" class="text-white text-[12px] font-black px-7 py-1.5 rounded-full transition-transform hover:scale-105 active:scale-95" style="background: linear-gradient(180deg, #ff9a28 0%, #ff5e00 100%); box-shadow: 0 4px 15px rgba(255, 94, 0, 0.4);">Start</button>
                \` : \`
                <button disabled class="flex items-center justify-center text-white/50 bg-white/10 px-7 py-1.5 rounded-full cursor-not-allowed" style="border: 1px solid rgba(255,255,255,0.1);"><span class="material-symbols-outlined text-[14px]">lock</span></button>
                \`) + \`
            </div>
        </div>\`;
    });
    
    document.getElementById('tasks-container').innerHTML = html;
    
    let progressPercent = limit > 0 ? (window.completedTasks / limit) * 100 : 0;
    setTimeout(() => {
        let pb = document.getElementById('task-progress-bar');
        if(pb) pb.style.width = progressPercent + '%';
    }, 100);
}
`;
        
        let newPost = post.replace("picEl.classList.remove('hidden');", "picEl.style.display = 'block';");
        
        let finalCode = pre + newFunc + "\n    " + newPost;
        let b64 = Buffer.from(finalCode).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Rewrote generateTasks cleanly!");
    } else {
        console.log("Could not find markers to rewrite.");
    }
    
    ssh.dispose();
}
rewriteClean().catch(console.error);
