const fs = require('fs');

let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

// The line is: <span class="text-[16px] font-black text-slate-900 drop-shadow-sm">৳ ${parseFloat(dynamicReward).toFixed(2)}</span>
// We will replace it safely by matching dynamicReward
content = content.replace(/<span class="text-\[16px\] font-black text-slate-900 drop-shadow-sm">([^$]*)\$\{parseFloat\(dynamicReward\)\.toFixed\(2\)\}<\/span>/g, '<span class="text-[16px] font-black text-slate-900 drop-shadow-sm">$1${parseFloat(dynamicReward).toFixed(2)}<span class="text-[11px] text-slate-500 font-bold ml-1">/task</span></span>');

// If the user meant they wanted the TOTAL reward shown for that platform (e.g. 58 * 3 tasks = 174)
// It is better to just add "/task" so they know it's a PER TASK rate.

fs.writeFileSync(file, content);
console.log('Successfully appended /task to the reward text.');
