const fs = require('fs');
let html = fs.readFileSync('public/login.html', 'utf8');
html = html.replace('if (errorSpan) errorSpan.remove();', 'if (errorSpan && errorSpan.parentNode) { errorSpan.parentNode.removeChild(errorSpan); }');
fs.writeFileSync('public/login.html', html);
console.log('Fixed login.html');
