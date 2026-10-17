const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Reduce padding, make background almost completely transparent to look like a cutout
content = content.replace(/padding:\s*30px\s+20px;/g, 'padding: 20px 20px;');
content = content.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.3\);/g, 'background: rgba(255, 255, 255, 0.05);');

// Also make margin-bottom smaller to make it more compact
content = content.replace(/margin-bottom:\s*25px;/g, 'margin-bottom: 15px;');
content = content.replace(/margin:\s*0\s+auto\s+20px\s+auto;/g, 'margin: 0 auto 12px auto;');

fs.writeFileSync(file, content);
