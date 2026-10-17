const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Reduce modal padding (top/bottom)
content = content.replace(/padding:\s*25px\s*20px;/g, 'padding: 15px 20px;');

// Reduce icon size and margins
content = content.replace(/margin:\s*0\s*auto\s*15px\s*auto;\s*width:\s*64px;\s*height:\s*64px;/g, 'margin: 0 auto 10px auto; width: 48px; height: 48px;');
content = content.replace(/<svg\s*width="32"\s*height="32"/g, '<svg width="24" height="24"');

// Reduce title margin
content = content.replace(/font-size:\s*24px;\s*font-weight:\s*800;\s*margin-bottom:\s*8px;/g, 'font-size: 20px; font-weight: 800; margin-bottom: 4px;');

// Reduce text margin
content = content.replace(/font-size:\s*15px;\s*line-height:\s*1\.5;\s*margin-bottom:\s*20px;/g, 'font-size: 14px; line-height: 1.3; margin-bottom: 12px;');

// Reduce button padding
content = content.replace(/padding:\s*16px;/g, 'padding: 12px;');

// Reduce cancel button margin
content = content.replace(/margin-top:\s*15px;/g, 'margin-top: 10px;');

fs.writeFileSync(file, content);
console.log('Made modal extremely compact in height');
