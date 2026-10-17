const fs = require('fs');

let file = 'public/glassmorphic_1/code.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the hardcoded mock calculations with real-time ones based on profile data
const mockLogic = /\/\/ Total Portfolio Value[\s\S]*?const invested = profile\.vip_plan !== 'Free' \? 1699 : 0;[\s\S]*?document\.getElementById\('user-invested'\)\.innerText = invested\.toLocaleString\('en-IN', \{minimumFractionDigits: 2\}\);/g;

const realLogic = `// 1. Determine VIP level and Invested Capital
                    const vipLevel = (profile.vip_plan && profile.vip_plan !== 'Free') ? parseInt(profile.vip_plan.replace('VIP ', '')) || 0 : 0;
                    // Approximate VIP Prices based on standard scaling (can be adjusted if needed)
                    const investedMap = { 0: 0, 1: 1699, 2: 4500, 3: 8900, 4: 15000, 5: 35000, 6: 70000 }; 
                    const invested = investedMap[vipLevel] || 0;
                    
                    // 2. Real Available Balance
                    const balance = profile.balance || 0;
                    
                    // 3. Real Total Portfolio Value = Balance + Invested
                    const portfolioValue = balance + invested;
                    
                    // Update DOM
                    document.getElementById('user-balance').innerText = portfolioValue.toLocaleString('en-IN', {minimumFractionDigits: 2}); // Portfolio
                    document.getElementById('today-income').innerText = balance.toLocaleString('en-IN', {minimumFractionDigits: 2}); // Available Balance
                    document.getElementById('user-invested').innerText = invested.toLocaleString('en-IN', {minimumFractionDigits: 2}); // Invested Capital
                    
                    // 4. Real Total Earnings (Assuming today_income is tracking task earnings or we just use balance)
                    const totalEarnings = profile.today_income || 0; 
                    document.getElementById('user-total-earnings').innerText = totalEarnings.toLocaleString('en-IN', {minimumFractionDigits: 2});`;

content = content.replace(mockLogic, realLogic);

fs.writeFileSync(file, content);
console.log('Successfully updated dashboard values to be real-time.');
