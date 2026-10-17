const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'async function generateTasks() {';
const endStr = 'document.getElementById(\'tasks-container\').innerHTML = html;';
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + endStr.length);
    
    const newLogic = `async function generateTasks() {
            let tasks = [];
            let vipInfo = { level: 0 };
            
            try {
                let token = localStorage.getItem('userToken');
                if (!token && window.parent) {
                    try { token = window.parent.localStorage.getItem('userToken'); } catch(e) {}
                }
                
                if (token) {
                    const resTasks = await fetch('/api/tasks?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (resTasks.ok) {
                        tasks = await resTasks.json();
                    }
                    
                    const resProf = await fetch('/api/profile?t=' + new Date().getTime(), {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (resProf.ok) {
                        const p = await resProf.json();
                        if(p && p.vip_plan !== 'Free') {
                            vipInfo.level = parseInt(p.vip_plan.replace('VIP ', '')) || 1;
                        }
                    }
                }
            } catch (e) {
                console.error("Error fetching tasks/profile for iframe", e);
            }
            
            const limitMap = {0: 1, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 14};
            const limit = limitMap[vipInfo.level] || 1;
            
            let html = \`
                  <!-- Authentic Original True Glassmorphism VIP Card (Large & Premium) -->
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
                  <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-10 flex flex-col items-center justify-center text-center shadow-sm">
                      <span class="material-symbols-outlined text-[48px] text-white/50 mb-3">task</span>
                      <p class="text-white/80 font-bold">No tasks available right now.</p>
                  </div>\`;
              } else {
                  tasks.forEach(task => {
                      const typeToIcon = {
                          'youtube': svgMap['YouTube'],
                          'facebook': svgMap['Facebook'],
                          'tiktok': svgMap['TikTok'],
                          'telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
                      };
                      const iconUrl = typeToIcon[task.type] || svgMap['YouTube'];
                      const displayPlatform = task.type.charAt(0).toUpperCase() + task.type.slice(1);
                      
                      html += \`
                      <!-- Slim & Compact Glassmorphism Task Card (No Badges) -->
                      <div class="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[18px] p-2.5 shadow-sm flex items-center justify-between group transition-all hover:bg-white/20 mb-3">
                          <div class="flex items-center gap-3 w-[70%]">
                              <div class="w-11 h-11 rounded-[14px] bg-white/20 border border-white/30 flex items-center justify-center shrink-0 p-2.5 shadow-inner">
                                  <img src="\${iconUrl}" class="w-full h-full object-contain drop-shadow-md">
                              </div>
                              <div class="flex-1 min-w-0">
                                  <h4 class="text-[15px] font-bold text-white truncate drop-shadow-sm leading-tight">\${displayPlatform}</h4>
                                  <p class="text-white/70 text-[11px] font-black uppercase tracking-widest mt-0.5">\${limit} TASKS TODAY</p>
                              </div>
                          </div>
                          <div class="flex flex-col items-end gap-1 shrink-0">
                              <span class="text-[16px] font-black text-orange-400 drop-shadow-sm">৳ \${parseFloat(task.reward).toFixed(2)}</span>
                              <button onclick="startTask(\${task.id})" class="bg-white text-slate-900 text-[11px] font-black px-4 py-1.5 rounded-full shadow-md">Start</button>
                          </div>
                      </div>\`;
                  });
              }
              
              document.getElementById('tasks-container').innerHTML = html;`;
              
    content = before + newLogic + after;
    
    // Fix progress text assignments below it to match the large card format
    content = content.replace(/document\.getElementById\('task-progress-text'\)\.innerHTML = completed \+ '<span class="text-\[15px\] text-white\/80">\/' \+ limit \+ '<\/span>';/g, "document.getElementById('task-progress-text').innerText = `${completed}/${limit}`;");
    content = content.replace(/document\.getElementById\('vip-level-display'\)\.innerText = vipInfo\.level === 0 \? 'FREE PROFILE' : 'VIP LEVEL ' \+ vipInfo\.level;/g, "document.getElementById('vip-level-display').innerText = vipInfo.level === 0 ? 'FREE PROFILE' : 'VIP LEVEL ' + vipInfo.level;");

    fs.writeFileSync(file, content);
    console.log('Forcefully injected perfect generateTasks with Large VIP Card and Slim Tasks.');
} else {
    console.log('Failed to find start or end bounds for generateTasks.');
}
