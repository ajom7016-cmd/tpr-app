const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /const displayPlatform = task\.type\.charAt\(0\)\.toUpperCase\(\) \+ task\.type\.slice\(1\);[\s\S]*?<div class="w-10 h-10 flex items-center justify-center shrink-0">\s*<img src="\$\{iconUrl\}" class="w-full h-full object-contain drop-shadow-md">/m;

const replacement = \`const displayPlatform = task.type.charAt(0).toUpperCase() + task.type.slice(1);
                      
                      const scaleMap = {
                          'youtube': 'scale-[1.35]',
                          'facebook': 'scale-[0.95]',
                          'telegram': 'scale-[0.95]',
                          'tiktok': 'scale-[0.90]'
                      };
                      const extraClass = scaleMap[task.type] || '';
                      
                      html += \`
                      <!-- Slim & Compact Glassmorphism Task Card (No Badges) -->
                      <div class="bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-[18px] p-2.5 shadow-sm flex items-center justify-between group transition-all hover:bg-white/20 mb-3">
                          <div class="flex items-center gap-3 w-[70%]">
                              <div class="w-10 h-10 flex items-center justify-center shrink-0">
                                  <img src="\${iconUrl}" class="w-full h-full object-contain drop-shadow-md transition-transform duration-300 \${extraClass}">\`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully applied custom scaling to normalize logo sizes.');
} else {
    console.log('Regex did not match.');
}
