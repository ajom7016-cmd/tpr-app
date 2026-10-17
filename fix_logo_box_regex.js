const fs = require('fs');
let file = 'public/glassmorphic_2/code.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div class="w-11 h-11 rounded-\[14px\] bg-white\/20 border border-white\/30 flex items-center justify-center shrink-0 p-2\.5 shadow-inner">([\s\S]*?)<\/div>/;

const replacement = \`<div class="w-10 h-10 flex items-center justify-center shrink-0">
                                  <img src="\${iconUrl}" class="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform">
                              </div>\`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully removed the inner box around the logos.');
} else {
    console.log('Regex did not match.');
}
