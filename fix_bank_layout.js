const fs = require('fs');

let file = 'public/bank_details_glass/code.html';
let text = fs.readFileSync(file, 'utf8');

// The original file had a weird orphaned </div>, and missing flex-1
text = text.replace(/<\/div>\s*<div class="max-w-\[400px\] mx-auto relative z-10 h-full flex flex-col pt-6">/, 
    '<div class="max-w-[400px] w-full mx-auto relative z-10 flex-1 flex flex-col pt-6">');

fs.writeFileSync(file, text);
console.log('Fixed bank details');
