const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const oldStr = 'const displayPlatform = task.type.charAt(0).toUpperCase() + task.type.slice(1);\n                      \n                      html += `\n                      <!-- Slim & Compact Glassmorphism Task Card (No Badges) -->\n                      <div class="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[18px] p-2.5 shadow-sm flex items-center justify-between group transition-all hover:bg-white/20 mb-3">\n                          <div class="flex items-center gap-3 w-[70%]">\n                              <div class="w-10 h-10 flex items-center justify-center shrink-0">\n                                  <img src="${iconUrl}" class="w-full h-full object-contain drop-shadow-md">';

const newStr = 'const displayPlatform = task.type.charAt(0).toUpperCase() + task.type.slice(1);\n                      const scaleMap = { "youtube": "scale-[1.35]", "facebook": "scale-[0.95]", "telegram": "scale-[0.95]", "tiktok": "scale-[0.90]" };\n                      const extraClass = scaleMap[task.type] || "";\n                      html += `\n                      <!-- Slim & Compact Glassmorphism Task Card (No Badges) -->\n                      <div class="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[18px] p-2.5 shadow-sm flex items-center justify-between group transition-all hover:bg-white/20 mb-3">\n                          <div class="flex items-center gap-3 w-[70%]">\n                              <div class="w-10 h-10 flex items-center justify-center shrink-0">\n                                  <img src="${iconUrl}" class="w-full h-full object-contain drop-shadow-md transition-transform duration-300 ${extraClass}">';

const idx = content.indexOf('const displayPlatform = task.type.charAt(0).toUpperCase() + task.type.slice(1);');

if (idx !== -1) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Successfully applied custom scaling to normalize logo sizes.');
} else {
    console.log('Failed to find replacement target string.');
}
