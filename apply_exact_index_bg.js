const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

// Use the exact background CSS from index.html so it matches 100% perfectly without looking washed out or blurry
content = content.replace(/background:\s*url\('\/assets\/bg_main\.jpg'\)[^;]+;/g, "background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.12)), url('/assets/bg_main.jpg') center/cover no-repeat fixed;");

fs.writeFileSync(file, content);
