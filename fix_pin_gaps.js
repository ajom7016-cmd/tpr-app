const fs = require('fs');
let content = fs.readFileSync('public/security_change_pin/code.html', 'utf8');

content = content.replace('--gap-width: 71px;', '--gap-width: 73px;');
content = content.replace('--gap-width: 52px;', '--gap-width: 54px;');
content = content.replace('--gap-width: 102px;', '--gap-width: 104px;');

fs.writeFileSync('public/security_change_pin/code.html', content);
console.log('Done');
