const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/let inactiveSize = 'text-\[9px\]';/g, "let inactiveSize = 'text-[11px]';");
text = text.replace(/let activeSize = 'text-\[12px\]';/g, "let activeSize = 'text-[13px]';");

fs.writeFileSync(file, text);
console.log('Increased header text sizes');
