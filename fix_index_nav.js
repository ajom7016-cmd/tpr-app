const fs = require('fs');

let file = 'public/index.html';
let text = fs.readFileSync(file, 'utf8');

// Replace the bottom nav HTML
const oldNavRegex = /<div class="bottom-nav">[\s\S]*?<\/div>/;
const newNavHTML = `<div class="bottom-nav">
        <a href="#" onclick="loadPage('glassmorphic_1/code.html', this); return false;" class="nav-item active">
            <span class="material-symbols-outlined text-[24px]">home</span>
            <span>Home</span>
        </a>
        <a href="#" onclick="loadPage('glassmorphic_2/code.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            <span>Earnings</span>
        </a>
        <a href="#" onclick="loadPage('investment_premium_glass/vip.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">diamond</span>
            <span>VIP</span>
        </a>
        <a href="#" onclick="loadPage('user_profile_premium_glass/code.html', this); return false;" class="nav-item">
            <span class="material-symbols-outlined text-[24px]">person</span>
            <span>Profile</span>
        </a>
    </div>`;

text = text.replace(oldNavRegex, newNavHTML);

// Replace the mainPages array
const oldMainPagesRegex = /const mainPages = \[\s*'[^\\]+?',\s*'[^\\]+?',\s*'[^\\]+?',\s*'[^\\]+?'\s*\];/g;
const newMainPages = `const mainPages = [
            'glassmorphic_1/code.html', 
            'glassmorphic_2/code.html', 
            'investment_premium_glass/vip.html', 
            'user_profile_premium_glass/code.html'
        ];`;
text = text.replace(oldMainPagesRegex, newMainPages);


fs.writeFileSync(file, text);
console.log('Fixed index.html bottom nav to match the original layout');
