const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ 6\. Request Withdrawal[\s\S]*?\/\/ 7\. Get Transaction History/;
content = content.replace(regex, '// 7. Get Transaction History');

fs.writeFileSync(file, content);
console.log('Removed duplicate /api/withdraw route');
