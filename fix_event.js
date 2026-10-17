const fs = require('fs');
const file = 'C:/Users/ajom7/Downloads/TPR/JMJ_App/public/investment_premium_glass/vip.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /const btn = event\.target\.closest.*?setTimeout.*?500\);/gs;

const newCode = `
                            let btn = window.event ? (window.event.target.closest('button') || window.event.target) : null;
                            if (btn) {
                                btn.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
                                setTimeout(() => btn.style.animation = '', 500);
                            }
`;

content = content.replace(regex, newCode);
fs.writeFileSync(file, content);
console.log('Fixed JS event error');
