const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

const historyButton = `              <!-- History -->
              <div class="flex flex-col items-center gap-2 cursor-pointer searchable-item" onclick="window.parent.loadPage('glassmorphic_3/code.html', null)">
                  <div class="action-box text-slate-700">
                      <span class="material-symbols-outlined text-[26px]" style="font-variation-settings: 'wght' 300;">history</span>
                  </div>
                  <span class="text-[13px] font-bold text-slate-800">History</span>
              </div>
              <!-- Tasks -->`;

content = content.replace('<!-- Tasks -->', historyButton);
fs.writeFileSync(file, content);
console.log('Restored History button');
