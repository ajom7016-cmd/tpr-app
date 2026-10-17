const fs = require('fs');
let file = 'public/index.html';
let content = fs.readFileSync(file, 'utf8');

// Remove all marginBottom logic for app-frame
content = content.replace(/document\.getElementById\('app-frame'\)\.style\.marginBottom = '74px';/g, '');
content = content.replace(/document\.getElementById\('app-frame'\)\.style\.marginBottom = '0px';/g, '');

fs.writeFileSync(file, content);
console.log('Fixed iframe cutoff bug');
