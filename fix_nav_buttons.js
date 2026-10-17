const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace Rewards with Tasks
text = text.replace(/<span class="material-symbols-outlined text-\[26px\]">card_giftcard<\/span>\s*<span>Rewards<\/span>/g, `<span class="material-symbols-outlined text-[26px]">assignment</span>
            <span>Tasks</span>`);
text = text.replace(/{ title: 'REWARDS',/g, "{ title: 'TASKS',");

// Replace Support with Plan and link it to vip.html
const oldSupportRegex = /<a href="#" onclick="loadPage\('support_glass\/code\.html', this\); return false;" class="nav-item">\s*<span class="material-symbols-outlined text-\[26px\]">headset_mic<\/span>\s*<span>Support<\/span>\s*<\/a>/;
const newPlanHTML = `<a href="#" onclick="loadPage('investment_premium_glass/vip.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[26px]">diamond</span>
            <span>Plan</span>
        </a>`;
text = text.replace(oldSupportRegex, newPlanHTML);

// Update mainPages array to include vip.html instead of support_glass
const oldMainPages = `const mainPages = [
              'glassmorphic_1/code.html', 
              'glassmorphic_2/code.html', 
              'support_glass/code.html', 
              'user_profile_premium_glass/code.html'
          ];`;
const newMainPages = `const mainPages = [
              'glassmorphic_1/code.html', 
              'glassmorphic_2/code.html', 
              'investment_premium_glass/vip.html', 
              'user_profile_premium_glass/code.html'
          ];`;
text = text.replace(oldMainPages, newMainPages);

// Update bottomNavIdx in appPages
text = text.replace(/{ title: 'SUPPORT', [^}]+ bottomNavIdx: null },/g, ""); // Remove old support if needed, or just leave it. Let's just fix the index manually.
text = text.replace(/bottomNavIdx: null \},/g, "bottomNavIdx: null },"); // dummy

text = text.replace(/\{ title: 'SUPPORT', keywords: \['support', 'help', 'ai', 'chat', 'bot', 'customer'\], url: 'support_glass\/code\.html', icon: 'headset_mic', bottomNavIdx: null \},/, `{ title: 'SUPPORT', keywords: ['support', 'help', 'ai', 'chat', 'bot', 'customer'], url: 'support_glass/code.html', icon: 'headset_mic', bottomNavIdx: null },`);
text = text.replace(/\{ title: 'VIP', keywords: \['vip', 'deposit', 'invest', 'plan', 'premium', 'add money'\], url: 'investment_premium_glass\/vip\.html', icon: 'diamond', bottomNavIdx: 2 \},/, `{ title: 'PLAN', keywords: ['vip', 'deposit', 'invest', 'plan', 'premium', 'add money'], url: 'investment_premium_glass/vip.html', icon: 'diamond', bottomNavIdx: 2 },`);

fs.writeFileSync(file, text);
console.log('Changed Rewards to Tasks, and Support to Plan');
