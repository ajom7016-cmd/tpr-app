const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /let html = \`[\s\S]*?document\.getElementById\('tasks-container'\)\.innerHTML = html;/m;

const newLogic = `let html = \`
                  <!-- Authentic Original True Glassmorphism VIP Card -->
                  <div class="relative bg-white/10 backdrop-blur-[24px] border border-white/40 rounded-[32px] p-6 mb-8 mt-[-10px] shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                      <!-- Top Row -->
                      <div class="flex justify-between items-start mb-6">
                          <div class="w-12 h-12 rounded-[18px] bg-white/20 border border-white/30 flex items-center justify-center shadow-inner relative overflow-hidden">
                              <span class="material-symbols-outlined text-white text-[24px]">workspace_premium</span>
                              <img id="vip-user-pic" src="" class="w-full h-full object-cover hidden absolute inset-0 z-20">
                          </div>
                          <div class="bg-white/10 border border-white/20 rounded-full py-1.5 px-4 flex items-center gap-2">
                              <span class="material-symbols-outlined text-white/80 text-[16px]">person</span>
                              <span id="vip-user-name" class="text-white text-[13px] font-bold">User Name</span>
                          </div>
                      </div>
                      
                      <!-- Middle Text -->
                      <div class="mb-6">
                          <p class="text-white/70 text-[11px] font-black tracking-[0.2em] uppercase mb-1">VIP STATUS CARD</p>
                          <h2 id="vip-level-display" class="text-white text-[42px] font-black leading-none tracking-tight drop-shadow-md">VIP LEVEL 0</h2>
                      </div>
                      
                      <!-- Progress Area -->
                      <div class="bg-white/5 border border-white/10 rounded-[20px] p-4 mb-5 shadow-inner">
                          <div class="flex items-center gap-2 mb-3">
                              <span id="task-progress-text" class="text-white font-black text-[22px] leading-none">0/0</span>
                              <span class="text-white/70 text-[13px] font-bold leading-none mt-1">Tasks Completed</span>
                          </div>
                          <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                              <div id="task-progress-bar" class="h-full bg-white rounded-full w-[0%]"></div>
                          </div>
                      </div>
                      
                      <!-- Bottom Perks -->
                      <div class="flex items-center justify-center gap-6">
                          <div class="flex items-center gap-2">
                              <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                              <span class="text-white/90 text-[12px] font-bold">Earn Bonus: +15%</span>
                          </div>
                          <div class="flex items-center gap-2">
                              <div class="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                              <span class="text-white/90 text-[12px] font-bold">Exclusive Offers</span>
                          </div>
                      </div>
                  </div>
              \`;
              
              if (tasks.length === 0) {
                  html += \`
                  <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-10 flex flex-col items-center justify-center text-center shadow-lg mt-4">
                      <span class="material-symbols-outlined text-[48px] text-white/50 mb-3">task</span>
                      <p class="text-white/80 font-bold">No tasks available right now.</p>
                  </div>\`;
              } else {
                  tasks.forEach(task => {
                      // Map type to proper icon
                      const typeToIcon = {
                          'youtube': svgMap['YouTube'],
                          'facebook': svgMap['Facebook'],
                          'tiktok': svgMap['TikTok'],
                          'telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
                      };
                      const iconUrl = typeToIcon[task.type] || svgMap['YouTube'];
                      
                      html += \`
                      <!-- True Glassmorphism Task Card -->
                      <div class="bg-white/10 backdrop-blur-[20px] border border-white/30 rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] flex items-center justify-between group transition-all hover:bg-white/20 mb-4">
                          <div class="flex items-center gap-4 w-[70%]">
                              <div class="w-14 h-14 rounded-[18px] bg-white/20 border border-white/30 flex items-center justify-center shrink-0 p-3 shadow-inner">
                                  <img src="\${iconUrl}" class="w-full h-full object-contain drop-shadow-md">
                              </div>
                              <div class="flex-1 min-w-0">
                                  <div class="flex items-center gap-2 mb-1">
                                      <span class="px-2.5 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-wider shadow-sm">\${task.type}</span>
                                  </div>
                                  <h4 class="text-[16px] font-bold text-white truncate drop-shadow-sm">\${task.title}</h4>
                              </div>
                          </div>
                          <div class="flex flex-col items-end gap-2 shrink-0">
                              <span class="text-[18px] font-black text-orange-400 drop-shadow-sm">৳ \${parseFloat(task.reward).toFixed(2)}</span>
                              <button onclick="startTask(\${task.id})" class="bg-white text-slate-900 text-[12px] font-black px-5 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-[0_4px_15px_rgba(255,255,255,0.3)]">Start Task</button>
                          </div>
                      </div>\`;
                  });
              }
              
              document.getElementById('tasks-container').innerHTML = html;`;

if (content.match(regex)) {
    content = content.replace(regex, newLogic);
    
    // Also fix the VIP text update logic to match the new card structure
    const updateRegex = /document\.getElementById\('task-progress-text'\)\.innerHTML = completed \+ '.*';/m;
    content = content.replace(updateRegex, "document.getElementById('task-progress-text').innerText = `${completed}/${limit}`;");
    
    fs.writeFileSync(file, content);
    console.log('Restored the original ultra-premium VIP card and true glassmorphism task cards.');
} else {
    console.log('Regex did not match.');
}
