const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldCardRegex = /<!-- Status Bar \/ Progress -->\s*<div class="max-w-4xl mx-auto mb-8 px-2 sm:px-4">[\s\S]*?<!-- Tasks Grid -->/m;

const newCard = `<!-- Status Bar / Progress -->
    <div class="max-w-4xl mx-auto mb-8 px-2 sm:px-4">
        <!-- Highly Transparent Glassmorphism (Sotcho Glass) -->
        <div class="bg-white/10 backdrop-blur-[30px] rounded-[24px] p-5 sm:px-8 sm:py-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/30">
            
            <!-- Subtle white glow -->
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-white/20 blur-[40px] rounded-full pointer-events-none"></div>
            
            <!-- Top row: Crown and User Info -->
            <div class="flex justify-between items-center mb-4 relative z-10">
                <div class="w-10 h-10 flex items-center justify-center rounded-[12px] bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
                    <span class="material-symbols-outlined text-white text-[24px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
                </div>
                
                <div class="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/20 backdrop-blur-md shadow-sm">
                    <div class="w-6 h-6 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border border-white/30">
                        <span class="material-symbols-outlined text-white text-[16px]">person</span>
                    </div>
                    <div>
                        <p id="vip-user-name" class="text-white text-[13px] font-bold leading-none tracking-wide">User Name</p>
                    </div>
                </div>
            </div>
            
            <!-- Titles -->
            <div class="relative z-10 mb-4">
                <p class="text-white/80 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">VIP STATUS CARD</p>
                <h3 id="vip-level-display" class="text-white text-[32px] sm:text-[40px] font-black leading-none tracking-tight">VIP LEVEL 0</h3>
            </div>
            
            <!-- Progress Area (Clean transparent glass) -->
            <div class="bg-white/10 border border-white/20 rounded-[16px] p-3 sm:p-4 backdrop-blur-xl relative z-10 shadow-sm">
                <div class="flex items-end gap-2 mb-2">
                    <span id="task-progress-text" class="text-[22px] font-black text-white tracking-wide">0<span class="text-[14px] text-white/70">/0</span></span>
                    <span class="text-white/90 font-bold text-[13px] mb-1">Tasks Completed</span>
                </div>
                
                <!-- Progress Bar -->
                <div class="w-full h-[8px] bg-black/20 rounded-full overflow-hidden shadow-inner border border-white/10 relative">
                    <div id="task-progress-bar" class="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full w-[0%] relative shadow-[0_0_10px_rgba(249,115,22,0.4)] transition-all duration-1000">
                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Footer -->
            <div class="flex gap-5 mt-4 px-2 justify-center sm:justify-start text-white/90 text-[12px] font-bold relative z-10">
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                    Earn Bonus: +15%
                </div>
                <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]"></div>
                    Exclusive Offers
                </div>
            </div>
        </div>
    </div>

    <!-- Tasks Grid -->`;

if (content.match(oldCardRegex)) {
    content = content.replace(oldCardRegex, newCard);
    
    // JS Logic for Progress numbers
    content = content.replace(/text-white\/90/g, "text-white/70");

    fs.writeFileSync(file, content);
    console.log('Replaced VIP card with Highly Transparent Glass');
} else {
    console.log('Could not match VIP card section in glassmorphic_2');
}
