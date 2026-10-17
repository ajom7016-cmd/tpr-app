const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldCardRegex = /<!-- Status Bar \/ Progress -->\s*<div class="max-w-3xl mx-auto mb-12">[\s\S]*?<!-- Tasks Grid -->/m;

const newCard = `<!-- Status Bar / Progress -->
    <div class="max-w-3xl mx-auto mb-12 px-4 sm:px-0">
        <div class="bg-[#1e293b] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-slate-700">
            <!-- Glows - Removed red as requested, kept minimal white glow -->
            <div class="absolute top-0 left-0 w-40 h-40 bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <!-- Top row: Crown and User Info -->
            <div class="flex justify-between items-start mb-6 relative z-10">
                <div class="w-12 h-12 flex items-center justify-center rounded-[12px] bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                    <span class="material-symbols-outlined text-white text-[28px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
                </div>
                
                <div class="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20 backdrop-blur-md shadow-sm">
                    <div class="w-6 h-6 rounded-full bg-slate-500 overflow-hidden flex items-center justify-center">
                        <span class="material-symbols-outlined text-white text-[16px]">person</span>
                    </div>
                    <div>
                        <p id="vip-user-name" class="text-white text-[12px] font-bold leading-none tracking-wide">User</p>
                    </div>
                </div>
            </div>
            
            <!-- Titles -->
            <div class="relative z-10">
                <p class="text-white/60 font-bold text-[11px] uppercase tracking-[0.2em] mb-1">VIP STATUS CARD</p>
                <h3 id="vip-level-display" class="text-white text-[32px] sm:text-[40px] font-black leading-none mb-6 tracking-tight">VIP লেভেল 0</h3>
            </div>
            
            <!-- Progress Area -->
            <div class="bg-white/10 border border-white/20 rounded-[16px] p-4 sm:p-5 backdrop-blur-md relative z-10 shadow-lg">
                <div class="flex justify-between items-end mb-3">
                    <div class="flex items-baseline gap-2">
                        <span id="task-progress-text" class="text-[24px] font-black text-white tracking-wide">0 <span class="text-[14px] text-white/50">/ 0</span></span>
                        <span class="text-white/70 font-medium text-[13px]">Tasks Completed</span>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full h-[10px] bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/10 relative">
                    <div id="task-progress-bar" class="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full w-[0%] relative shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000">
                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Footer -->
            <div class="flex flex-wrap gap-4 mt-5 px-2 justify-center sm:justify-start text-white/70 text-[13px] font-medium relative z-10">
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    Earn Bonus: +15%
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    Exclusive Offers
                </div>
            </div>
        </div>
    </div>

    <!-- Tasks Grid -->`;

if (content.match(oldCardRegex)) {
    content = content.replace(oldCardRegex, newCard);
    
    // Inject script
    const targetScript = "function startTask(taskId) {";
    const scriptInject = `
    // Set username dynamically for the new VIP card
    try {
        const userData = JSON.parse(localStorage.getItem('userVIP')) || {};
        let mainUser = {};
        try { mainUser = JSON.parse(window.parent.localStorage.getItem('user')); } catch(e) { mainUser = JSON.parse(localStorage.getItem('user')); }
        if (mainUser && mainUser.name) {
            document.getElementById('vip-user-name').innerText = mainUser.name.split(' ')[0];
        }
    } catch(e) {}
    
    function startTask(taskId) {`;
    
    content = content.replace(targetScript, scriptInject);
    
    // Replace slate-400 with white/50
    const oldJS = "text-[14px] text-slate-400";
    const newJS = "text-[14px] text-white/50";
    content = content.replace(oldJS, newJS);

    fs.writeFileSync(file, content);
    console.log('Replaced VIP card with new Frost White (Dark Slate base) design');
} else {
    console.log('Could not match VIP card section in glassmorphic_2');
}
