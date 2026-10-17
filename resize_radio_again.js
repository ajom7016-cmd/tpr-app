const fs = require('fs');
let file = 'public/withdraw_glass/code.html';
let content = fs.readFileSync(file, 'utf8');

// Change outer circle from w-5/h-5 to w-4/h-4
content = content.replace(
    /class="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white check-circle"/g,
    'class="w-4 h-4 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white check-circle"'
);

// Change inner dot from w-2.5/h-2.5 to w-2/h-2
content = content.replace(
    /class="w-2\.5 h-2\.5 rounded-full bg-orange-500 opacity-0 transition-opacity"/g,
    'class="w-2 h-2 rounded-full bg-orange-500 opacity-0 transition-opacity"'
);

fs.writeFileSync(file, content);
console.log('Made radio button even smaller and perfectly aligned');
