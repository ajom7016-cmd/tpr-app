const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /modal\.innerHTML\s*=\s*[\s\S]*?<div style="background: rgba[\s\S]*?Cancel<\/button>\s*<\/div>\s*<\/div>\s*;/g;

const newHTML = "modal.innerHTML = `\n" +
"    <div style=\"background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: 20px; padding: 25px; width: 85%; max-width: 340px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.3s ease;\">\n" +
"        <i class=\"fa-solid fa-wallet\" style=\"font-size: 50px; color: #f97316; filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.5)); margin-bottom: 15px;\"></i>\n" +
"        <h3 style=\"color: white; font-size: 22px; font-weight: 800; margin-bottom: 8px;\">Insufficient Balance</h3>\n" +
"        <p style=\"color: #9ca3af; font-size: 14px; margin-bottom: 20px; line-height: 1.5;\">${data.message}</p>\n" +
"        <div style=\"display: flex; gap: 10px; flex-direction: column;\">\n" +
"            <button id=\"recharge-now-btn\" style=\"background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; border-radius: 12px; padding: 14px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); cursor: pointer;\">Recharge Now <i class=\"fa-solid fa-arrow-right\" style=\"margin-left: 8px;\"></i></button>\n" +
"            <button id=\"cancel-recharge-btn\" style=\"background: rgba(255,255,255,0.1); color: white; border: none; border-radius: 12px; padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer;\">Cancel</button>\n" +
"        </div>\n" +
"    </div>\n" +
"`;";

content = content.replace(regex, newHTML);
fs.writeFileSync(file, content);
console.log('Fixed syntax error in vip.html');
