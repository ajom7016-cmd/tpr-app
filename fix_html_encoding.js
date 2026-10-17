const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// The file might be ANSI or something, so literal regex replaces:
content = content.replace(/ 3/g, '৳');
content = content.replace(/ 37.2%/g, '7.2%');
content = content.replace(/\+  37.2%/g, '+ 7.2%');

fs.writeFileSync(file, content);
console.log('Fixed static HTML encodings');
