const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Remove the JS transform manipulation
content = content.replace(/modal\.firstElementChild\.style\.transform\s*=\s*'translateY\(0\)';/g, '');

fs.writeFileSync(file, content);
console.log('Removed JS transform manipulation');
