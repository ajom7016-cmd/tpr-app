const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldCardRegex = /<!-- Status Bar \/ Progress -->\s*<div class="max-w-3xl mx-auto mb-12 px-4 sm:px-0">[\s\S]*?<!-- Tasks Grid -->/m;

const newCard = `<!-- Status Bar / Progress -->
    <div class="max-w-3xl mx-auto mb-12 px-4 sm:px-0">
        <!-- True Milky White Frosted Glass -->
        <div class="bg-white/50 backdrop-blur-[40px] rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-white/80">
            
            <!-- Minimal white highlight instead of red glow -->
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-white/60 blur-[40px] rounded-full pointer-events-none"></div>
            
            <!-- Top row: Crown and User Info -->
            <div class="flex justify-between items-start mb-6 relative z-10">
                <div class="w-12 h-12 flex items-center justify-center rounded-[16px] bg-white/40 border border-white/60 backdrop-blur-md shadow-sm">
                    <span class="material-symbols-outlined text-slate-800 text-[28px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
                </div>
                
                <div class="flex items-center gap-2 bg-white/40 rounded-full px-3 py-1.5 border border-white/60 backdrop-blur-md shadow-sm">
                    <div class="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-white/50">
                        <span class="material-symbols-outlined text-slate-600 text-[16px]">person</span>
                    </div>
                    <div>
                        <p id="vip-user-name" class="text-slate-800 text-[12px] font-black leading-none tracking-wide">User</p>
                    </div>
                </div>
            </div>
            
            <!-- Titles -->
            <div class="relative z-10">
                <p class="text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] mb-1">VIP STATUS CARD</p>
                <h3 id="vip-level-display" class="text-slate-900 text-[32px] sm:text-[42px] font-black leading-none mb-6 tracking-tight drop-shadow-sm">VIP লেভেল 0</h3>
            </div>
            
            <!-- Progress Area (Inner Glass Container) -->
            <div class="bg-white/40 border border-white/60 rounded-[20px] p-4 sm:p-5 backdrop-blur-xl relative z-10 shadow-sm">
                <div class="flex justify-between items-end mb-3">
                    <div class="flex items-baseline gap-2">
                        <span id="task-progress-text" class="text-[26px] font-black text-slate-900 tracking-wide drop-shadow-sm">0 <span class="text-[14px] text-slate-500">/ 0</span></span>
                        <span class="text-slate-600 font-bold text-[13px]">Tasks Completed</span>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full h-[12px] bg-slate-200/50 rounded-full overflow-hidden shadow-inner border border-slate-300/30 relative">
                    <div id="task-progress-bar" class="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full w-[0%] relative shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-1000">
                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Footer -->
            <div class="flex flex-wrap gap-5 mt-5 px-2 justify-center sm:justify-start text-slate-600 text-[13px] font-bold relative z-10">
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    Earn Bonus: +15%
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    Exclusive Offers
                </div>
            </div>
        </div>
    </div>

    <!-- Tasks Grid -->`;

if (content.match(oldCardRegex)) {
    content = content.replace(oldCardRegex, newCard);
    
    // Replace text-white/50 JS back to text-slate-500 for the light glassmorphism
    const oldJS = "text-[14px] text-white/50";
    const newJS = "text-[14px] text-slate-500";
    content = content.replace(oldJS, newJS);

    fs.writeFileSync(file, content);
    console.log('Replaced VIP card with True Milky White Glassmorphism');
} else {
    console.log('Could not match VIP card section in glassmorphic_2');
}
