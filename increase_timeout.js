const fs = require('fs');
let file = 'server.js';
let content = fs.readFileSync(file, 'utf8');

// Change timeout from 15000 to 45000
content = content.replace(/setTimeout\(\(\) => reject\(new Error\('Timeout_Exceeded'\)\), 15000\)/g, "setTimeout(() => reject(new Error('Timeout_Exceeded')), 45000)");

fs.writeFileSync(file, content);
console.log('Increased AI timeout to 45 seconds');
