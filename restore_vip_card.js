const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<!-- VIP Status Card -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m;

const newCard = `<!-- Ultra Clear Transparent VIP Card -->
                <div class="relative bg-white/5 backdrop-blur-[8px] border border-white/20 rounded-[20px] p-3 flex items-center justify-between mb-2 mt-[-10px]" style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); width: calc(100% + 2px); margin-left: -1px; margin-right: -1px;">
                    <!-- VIP Badge -->
                    <div class="flex items-center gap-3 relative z-10">
                        <div class="relative">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-lg">
                                <div class="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-900 overflow-hidden">
                                    <span class="material-symbols-outlined text-[20px] text-amber-400" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
                                    <img id="vip-user-pic" src="" class="w-full h-full object-cover hidden absolute inset-0 z-20">
                                </div>
                            </div>
                            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        </div>
                        <div>
                            <h3 id="vip-level-display" class="text-[18px] font-black text-white tracking-tight leading-none mb-1">VIP LEVEL</h3>
                            <p id="vip-user-name" class="text-white text-[15px] font-bold leading-none tracking-wide">User Name</p>
                        </div>
                    </div>
                    <!-- Task Limit Progress -->
                    <div class="flex flex-col items-end relative z-10">
                        <div class="text-[20px] font-black text-white leading-none mb-1" id="task-progress-text">0<span class="text-[15px] text-white/80">/0</span></div>
                        <div class="w-[70px] h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div id="task-progress-bar" class="h-full bg-gradient-to-r from-orange-400 to-amber-300 rounded-full w-[0%]"></div>
                        </div>
                    </div>
                </div>`;

if (content.match(regex)) {
    content = content.replace(regex, newCard);
    fs.writeFileSync(file, content);
    console.log('Restored the Ultra Clear Transparent VIP card with pure white text.');
} else {
    console.log('Could not find the VIP Status Card regex.');
}
