const fs = require('fs');
let file1 = 'public/bank_details_glass/code.html';
let t = fs.readFileSync(file1, 'utf8');
t = t.replace('<body class="min-h-screen flex flex-col pb-8">', '<body class="min-h-screen flex flex-col pt-[72px] pb-8">');
fs.writeFileSync(file1, t);

let file2 = 'public/profile_settings_glass/code.html';
let t2 = fs.readFileSync(file2, 'utf8');
t2 = t2.replace('<body class="pt-6 pb-24">', '<body class="pt-[72px] pb-24">');
fs.writeFileSync(file2, t2);

console.log('Fixed bodies');
