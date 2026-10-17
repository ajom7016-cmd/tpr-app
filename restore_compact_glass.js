const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /let html = \`[\s\S]*?document\.getElementById\('tasks-container'\)\.innerHTML = html;/m;

const newLogic = `let html = \`
                  <!-- Ultra Clear Transparent VIP Card (Compact & Slim) -->
                  <div class="relative bg-white/5 backdrop-blur-[8px] border border-white/20 rounded-[20px] p-3 flex items-center justify-between mb-4 mt-[-10px]" style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); width: calc(100% + 2px); margin-left: -1px; margin-right: -1px;">
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
                      <!-- Slim & Compact Glassmorphism Task Card -->
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

if (content.match(regex)) {
    content = content.replace(regex, newLogic);
    
    // Fix progress text
    const updateRegex = /document\.getElementById\('task-progress-text'\)\.innerText = `\$\{completed\}\/\$\{limit\}`;/m;
    content = content.replace(updateRegex, "document.getElementById('task-progress-text').innerHTML = completed + '<span class=\"text-[15px] text-white/80\">/' + limit + '</span>';");
    
    fs.writeFileSync(file, content);
    console.log('Restored compact VIP card and slim task cards.');
} else {
    console.log('Regex did not match.');
}
