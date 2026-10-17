const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function finalCardFix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let code = res.stdout;
    
    // Replace the HTML generation block
    const startMarker = "html += `";
    const endMarker = "`;\n    \n    document.getElementById('tasks-container')";
    
    if(code.includes(startMarker)) {
        const pre = code.substring(0, code.indexOf(startMarker));
        let post = code.substring(code.indexOf(endMarker) + 2); // keep `;\n
        
        const newCard = `
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
                <span id="vip-user-name" class="text-white text-[10px] font-black tracking-wider uppercase">USER</span>
            </div>
        </div>
        
        <!-- Middle Text -->
        <div class="mb-2">
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
    </div>\`;`;
        
        // Fix JS logic to ensure image shows up
        const imageLogicOld = "picEl.classList.remove('hidden');";
        const imageLogicNew = "picEl.style.display = 'block';";
        post = post.replaceAll(imageLogicOld, imageLogicNew);
        
        code = pre + newCard + post;
        
        let b64 = Buffer.from(code).toString('base64');
        await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/glassmorphic_2/code.html`);
        console.log("Final fix applied!");
    } else {
        console.log("Could not find marker.");
    }
    
    ssh.dispose();
}
finalCardFix().catch(console.error);
