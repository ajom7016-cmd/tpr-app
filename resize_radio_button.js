const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /class="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white check-circle"/g,
    'class="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white check-circle"'
);

content = content.replace(
    /class="w-3 h-3 rounded-full bg-orange-500 opacity-0 transition-opacity"/g,
    'class="w-2.5 h-2.5 rounded-full bg-orange-500 opacity-0 transition-opacity"'
);

fs.writeFileSync(file, content);
console.log('Made the radio button smaller');
