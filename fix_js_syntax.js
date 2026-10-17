const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// The file has things like: timeString +  3= 'Z';
// We need to fix ANY instance of +  3= to +=
// Because of encoding, we just replace `+ [anything]=` with `+=`
content = content.replace(/\+\s*[^=]*=/g, '+=');

// Also check for any other weird things like `timeString = timeString.replace(' ', 'T') +  3 'Z';`
content = content.replace(/\+\s*[^'"]*'/g, "+ '");
content = content.replace(/\+\s*[^'"]*`/g, "+ `");

fs.writeFileSync(file, content);
console.log('Fixed broken JavaScript operators');
