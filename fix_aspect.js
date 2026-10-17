const fs = require('fs');

// Fix Dashboard
let file1 = 'public/glassmorphic_1/code.html';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(/aspect-\[2\/1\] sm:aspect-\[21\/9\]/g, 'aspect-video');
fs.writeFileSync(file1, content1);

// Fix Refer Page
let file2 = 'public/refer_glass/code.html';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/aspect-\[21\/9\]/g, 'aspect-video');
fs.writeFileSync(file2, content2);

console.log('Fixed aspect ratio to 16:9 (aspect-video) in both files.');
