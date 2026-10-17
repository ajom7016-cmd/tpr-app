const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace weird encoding characters with correct ones
content = content.replace(/\+ 3/g, '+ ৳');
// Also replace it if it's just the character without the '3'
content = content.replace(/\+/g, '+ ৳');

// Since there is a weird unicode character, maybe we should just regex the whole line
content = content.replace(/`<span class="block text-\[14px\] font-black text-green-600">\+[^<]*<\/span>`/, '`<span class="block text-[14px] font-black text-green-600">+ ৳ ${task.reward}</span>`');

fs.writeFileSync(file, content);
console.log('Fixed weird character encoding in reward HTML');
