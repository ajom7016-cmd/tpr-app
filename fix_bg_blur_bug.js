const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Remove the transform and transition that are causing the browser to blur the fixed background image
content = content.replace(/transform:\s*translateY\(20px\);\s*transition:\s*transform[^;]+;/g, '');

fs.writeFileSync(file, content);
console.log('Removed transform to fix fixed background blur bug');
