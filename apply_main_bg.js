const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Change the modal's background from rgba to the actual background image of the main app
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.05\);/g, 'background: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(\'/assets/bg_main.jpg\') center/cover;');

fs.writeFileSync(file, content);
